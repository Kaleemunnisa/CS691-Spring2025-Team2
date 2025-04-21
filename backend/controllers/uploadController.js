const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const dotenv = require('dotenv');
const Image = require('../models/imageModel'); // MongoDB model
const { v4: uuidv4 } = require('uuid');
const { PythonShell } = require('python-shell');

dotenv.config();

const MAX_PROCESSING_TIME = 45000;

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const storage = multer.memoryStorage();
const upload = multer({ storage });
exports.uploadMiddleware = upload.single('image');

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const { user_id } = req.body;
        if (!user_id) return res.status(400).json({ error: 'User ID is required' });

        const rawFilename = `${Date.now()}_${uuidv4()}`;
        const pythonScriptPath = require('path').join(__dirname, '../cv/preprocess_image.py');

        console.log("[UPLOAD] Starting Python image preprocessing...");

        // Run Python and pipe base64 image string
        const buffer = await new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                console.error("[PYTHON ERROR] Script timed out");
                reject(new Error("Image processing timed out."));
            }, MAX_PROCESSING_TIME);

            const pyshell = new PythonShell(pythonScriptPath, {
                mode: 'binary',
                pythonPath: 'python3',
                pythonOptions: ['-u'],
            });

            let chunks = [];

            pyshell.stdout.on('data', (chunk) => {
                chunks.push(chunk);
            });


            pyshell.stdin.write(req.file.buffer);
            pyshell.stdin.end();

            pyshell.end((err) => {
                clearTimeout(timeoutId);
                if (err) return reject(err);
                if (!chunks.length) return reject(new Error("No image data received from Python."));
            
                const buffer = Buffer.concat(chunks);
                resolve(buffer);
            });
        });

        console.log("[UPLOAD] Uploading to AWS S3...");

        const s3Params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `uploads/${rawFilename}.png`,
            Body: buffer,
            ContentType: 'image/png'
        };
        if (buffer.length === 0) {
            throw new Error("Image buffer is empty. Aborting upload.");
        }
        await s3.send(new PutObjectCommand(s3Params));
        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${rawFilename}.png`;

        const newImage = new Image({
            image_url: imageUrl,
            user_id,
            status: 'classified'
        });
        await newImage.save();

        console.log("[UPLOAD COMPLETE]");
        res.json({ image_id: newImage._id, image_url: imageUrl });

    } catch (err) {
        console.error("[UPLOAD ERROR]", err.message || err);
        res.status(500).json({ error: err.message || "Upload failed. Please try again." });
    }
};
