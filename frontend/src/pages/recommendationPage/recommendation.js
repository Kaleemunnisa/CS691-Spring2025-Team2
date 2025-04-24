import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import HeaderBar from "../../components/header/HeaderBar";
import "./recommendation.css";

const RecommendationPage = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRecommendation = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/recommendation`, {
                    params: {
                        userId: "user123",
                        clothingId: id,
                        lat: 40.71,
                        lon: -74.01
                    }
                });
                setData(response.data);
            } catch (err) {
                console.error("❌ Error fetching recommendation:", err);
                setError("Failed to fetch recommendation.");
            }
        };

        fetchRecommendation();
    }, [id]);

    return (
        <div className="recommendation-container">
            <HeaderBar />
            <div className="recommendation-content">
                <h2>Outfit Recommendation</h2>

                {error && <p>{error}</p>}
                {!error && !data && <p>Fetching recommendation...</p>}

                {data && (
                    <>
                        <h3>Temperature: {data.temperature}°C</h3>

                        <div className="base-item">
                            <h4>Your Uploaded Item</h4>
                            <img src={data.base_item.image} alt="Base item" className="item-image" />
                            <p><strong>{data.base_item.type}</strong> — {data.base_item.color}</p>
                        </div>

                        <div className="rec-section">
                            <h4>Recommended from Your Wardrobe:</h4>
                            {data.recommendations.length > 0 ? (
                                data.recommendations.map((item, index) => (
                                    <div key={index} className="item-card">
                                        <img src={item.image_url} alt={item.clothing_classification} className="item-image" />
                                        <p>{item.clothing_classification} — {item.detected_color}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No matching items found in wardrobe.</p>
                            )}
                        </div>

                        <div className="rec-section">
                            <h4>Suggestions to Complete the Look:</h4>
                            {data.missing.map((item, index) => (
                                <div key={index} className="missing-block">
                                    <p><strong>{item.type.toUpperCase()}</strong></p>
                                    <p>Options: {item.options.join(", ")}</p>
                                    <p>Matching Colors: {item.acceptableColors.join(", ")}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RecommendationPage;
