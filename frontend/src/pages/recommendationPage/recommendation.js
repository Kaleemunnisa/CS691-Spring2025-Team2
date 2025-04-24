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
                <h2 className="rec-title">Outfit Recommendation</h2>

                {error && <p>{error}</p>}
                {!error && !data && <p>Fetching recommendation...</p>}

                {data && (
                    <>
                        <div className="temperature-badge">
                            🌡️ {data.temperature.toFixed(1)}°C
                        </div>

                        <div className="card-grid">
                            {/* Base Item */}
                            <div className="item-card">
                                <div className="section-label">Your Upload</div>
                                <img src={data.base_item.image} alt="Base item" />
                                <div className="item-title">{data.base_item.type}</div>
                                <div className="item-color">{data.base_item.color}</div>
                            </div>

                            {/* Recommended Items */}
                            {data.recommendations.map((item, index) => (
                                <div key={index} className="item-card">
                                    <div className="section-label">Recommended </div>
                                    <img src={item.image_url} alt={item.clothing_classification} />
                                    <div className="item-title">{item.clothing_classification}</div>
                                    <div className="item-color">{item.detected_color}</div>
                                </div>
                            ))}

                            {/* Suggested Add-ons */}
                            {data.missing.map((item, index) => (
                                <div key={index} className="item-card">
                                    <div className="section-label">Suggested Add-on</div>
                                    <img src={`/fallbacks/black_${item.options[0].toLowerCase()}.png`} alt="addon" />
                                    <div className="item-title">{item.options[0]}</div>
                                    <div className="item-color">● fallback</div>
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
