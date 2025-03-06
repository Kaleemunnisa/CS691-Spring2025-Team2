import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import "./UploadPage.css";

const UploadPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return alert("Please select an image!");

        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("user_id", "user123"); // Replace with actual user ID

        try {
            setLoading(true);
            const uploadResponse = await axios.post("http://localhost:8000/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const { image_id, image_url } = uploadResponse.data;
            console.log("✅ Image uploaded:", image_url);

            // Call classification API
            const classifyResponse = await axios.post("http://localhost:8000/api/clothing/classify", {
                image_id: image_id,
                image_url: image_url,
                user_id: "user123",
            });

            console.log("✅ Classification Response:", classifyResponse.data);

            setLoading(false);

            // Redirect to Image Details Page with classification data
            navigate(`/details/${image_id}`, {
                state: {
                    image_url: image_url,
                    clothing_classification: classifyResponse.data.clothing_classification,
                    detected_color: classifyResponse.data.detected_color,
                    saved_clothing_id: classifyResponse.data.saved_clothing_id,
                },
            });

        } catch (error) {
            setLoading(false);
            console.error("❌ Upload or Classification Failed:", error);
            alert("Upload failed. Try again.");
        }
    };

    return (
        <div className="page-container">
            <Navbar /> {/* Universal Navigation Bar */}

            <h2 className="upload-title">Upload Your Clothing Item</h2>

            {/* Browse Button */}
            <input type="file" id="file-upload" className="file-input" accept="image/*" onChange={handleFileChange} />
            <label htmlFor="file-upload" className="custom-file-label">Browse Files</label>

            {preview && <img src={preview} alt="Preview" className="upload-preview" />}
            {/* Upload Button */}
            <button onClick={handleUpload} className="upload-button" disabled={loading}>
                {loading ? "Uploading..." : "Upload"}
            </button>

        </div>
    );
};

export default UploadPage;
