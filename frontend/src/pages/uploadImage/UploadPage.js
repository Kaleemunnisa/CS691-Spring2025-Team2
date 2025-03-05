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
        formData.append("user_id", "12345"); // Replace with actual user ID

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:8000/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setLoading(false);
            console.log("Image URL:", response.data.imageUrl);

            // Redirect to Image Details Page with Image URL
            navigate("/image-details", { state: { imageUrl: response.data.imageUrl } });

        } catch (error) {
            setLoading(false);
            console.error("Upload failed:", error);
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
