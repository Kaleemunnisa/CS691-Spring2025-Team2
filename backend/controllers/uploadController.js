const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const dotenv = require('dotenv');
const Image = require('../models/imageModel'); // MongoDB model

dotenv.config();

// AWS S3 Configuration
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Configure Multer with Memory Storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Get user_id from the request (frontend should send it)
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Define the S3 Upload Parameters
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `uploads/${Date.now()}_${req.file.originalname}`,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        };

        // Upload to S3
        const command = new PutObjectCommand(params);
        await s3.send(command);

        // Generate S3 Image URL
        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

        // Save the image URL and user_id in MongoDB
        const newImage = new Image({ image_url: imageUrl, user_id });
        await newImage.save();

        res.json({ imageUrl });
    } catch (error) {
        console.error("S3 Upload Error:", error);
        res.status(500).json({ error: 'Upload failed' });
    }
};

// Middleware to handle file upload
exports.uploadMiddleware = upload.single('image');
