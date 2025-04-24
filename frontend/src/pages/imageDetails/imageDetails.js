import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./imageDetails.css";
import { FaEdit, FaTimes } from "react-icons/fa";
import HeaderBar from "../../components/header/HeaderBar";

const ImageDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [imageData, setImageData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [category, setCategory] = useState("");
    const [color, setColor] = useState("");
    const [originalCategory, setOriginalCategory] = useState("");
    const [originalColor, setOriginalColor] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        const fetchClothingDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/clothing/${id}`);
                const data = response.data;
                setImageData(data);
                setCategory(data.clothing_classification || "unknown");
                setColor(data.detected_color || "N/A");
                setOriginalCategory(data.clothing_classification || "unknown");
                setOriginalColor(data.detected_color || "N/A");
                setLoading(false);
            } catch (error) {
                console.error("❌ Error fetching clothing details:", error);
                alert("Error loading clothing details.");
                navigate("/home");
            }
        };
        fetchClothingDetails();
    }, [id, navigate]);

    useEffect(() => {
        const hasChanged = category.trim() !== originalCategory.trim() || color.trim() !== originalColor.trim();
        setIsChanged(hasChanged);
    }, [category, color, originalCategory, originalColor]);

    const handleSaveChanges = async () => {
        if (isUpdating || !isChanged) return;
        setIsUpdating(true);

        try {
            const response = await axios.put(`http://localhost:8000/api/clothing/edit-clothing/${id}`, {
                clothing_classification: category,
                detected_color: color,
            });

            console.log("✅ Update Successful:", response.data);
            setIsEditing(false);
            setImageData({ ...imageData, clothing_classification: category, detected_color: color });
            setOriginalCategory(category);
            setOriginalColor(color);
            setIsChanged(false);
        } catch (error) {
            console.error("❌ Error updating details:", error);
            alert("Failed to update details. Try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleGenerateRecommendation = async () => {
        navigate(`/recommendation/${id}`);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCategory(originalCategory);
        setColor(originalColor);
    };

    if (loading) {
        return <div className="details-page-container"><p>Loading...</p></div>;
    }

    return (
        <div className="details-page-container">
            <HeaderBar />
            <div className="details-header">
                <h2 className="details-title">Image Details</h2>
                {isEditing ? (
                    <button className="closebutton" onClick={handleCancelEdit}>
                        <FaTimes />
                    </button>
                ) : (
                    <button className="edit-button" onClick={() => setIsEditing(true)}>
                        <FaEdit />
                    </button>
                )}
            </div>

            <img src={imageData.image_url} alt="Clothing Item" className="details-image" />

            {isEditing ? (
                <div className="details-form">
                    <label>Category:</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <option value="unknown">Select Category</option>
                        {["Shirt", "Tshirt", "Pant", "Jeans", "Jacket", "Coat"].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <label>Detected Color:</label>
                    <input type="text" value={color} onChange={(e) => setColor(e.target.value)} />
                    <button className="save-button" onClick={handleSaveChanges} disabled={!isChanged || isUpdating}>
                        {isUpdating ? "Saving..." : "Save Changes"}
                    </button>

                </div>
            ) : (
                <div className="details-text">
                    <div className="details-row">
                        <span className="details-label">Category:</span>
                        <span className="details-value">{category}</span>
                    </div>
                    <div className="details-row">
                        <span className="details-label">Detected Color:</span>
                        <span className="details-value">{color}</span>
                    </div>
                    <button
                        className={`recommend-button ${category === "unknown" ? "disabled" : ""}`}
                        onClick={handleGenerateRecommendation}
                        disabled={category === "unknown"}
                    >
                        Generate Recommendations
                    </button>

                    {category === "unknown" && (
                        <p className="warning-text">
                            ⚠️ Please select a valid category to enable recommendations.
                        </p>
                    )}



                </div>
            )}
        </div>
    );
};

export default ImageDetails;