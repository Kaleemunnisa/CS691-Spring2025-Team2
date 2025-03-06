import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import "./imageDetails.css";
import { FaEdit } from "react-icons/fa"; // Importing black edit icon

const ImageDetails = () => {
    const location = useLocation();
    const { image_url, clothing_classification, detected_color, saved_clothing_id } = location.state;

    const [isEditing, setIsEditing] = useState(false);
    const [category, setCategory] = useState(clothing_classification);
    const [color, setColor] = useState(detected_color);

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:8000/api/clothing/${saved_clothing_id}`, {
                clothing_classification: category,
                detected_color: color,
            });

            setIsEditing(false);
        } catch (error) {
            console.error("❌ Error updating clothing details:", error);
        }
    };

    return (
        <div className="page-container">
            <Navbar />

            {/* Header Section with Edit Icon */}
            <div className="details-header">
                <h2 className="details-title">Image Details</h2>
                {!isEditing && (
                    <button className="edit-button" onClick={() => setIsEditing(true)}>
                        <FaEdit />
                    </button>
                )}
            </div>

            {/* Image Display */}
            <img src={image_url} alt="Clothing" className="details-image" />

            {/* Editable Form */}
            {isEditing ? (
                <div className="details-form">
                    <label>Category:</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />

                    <label>Detected Color:</label>
                    <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />

                    <div className="save-button-container">
                        <button className="save-button" onClick={handleSave}>
                            Save Changes
                        </button>
                    </div>

                </div>
            ) : (
                <div className="details-view">
                    <div className="details-row">
                        <span className="details-label">Category:</span>
                        <span className="details-value">{category}</span>
                    </div>
                    <div className="details-row">
                        <span className="details-label">Detected Color:</span>
                        <span className="details-value">{color}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageDetails;
