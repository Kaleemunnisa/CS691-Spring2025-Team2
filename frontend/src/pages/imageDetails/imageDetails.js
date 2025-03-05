import React from "react";
import { useLocation } from "react-router-dom";
import "./ImageDetails.css";

const ImageDetails = () => {
    const location = useLocation();
    const imageUrl = location.state?.imageUrl;

    return (
        <div className="image-details-container">
            <div className="hanger-icon">🛍️</div>
            <img src={imageUrl} alt="Uploaded" className="uploaded-image" />
            
            <h3>Image Classification</h3>
            <p><strong>Category:</strong> T-Shirt</p>
            <p><strong>Color:</strong> White</p>
            
            <button className="edit-button">Edit Details</button>
        </div>
    );
};

export default ImageDetails;
