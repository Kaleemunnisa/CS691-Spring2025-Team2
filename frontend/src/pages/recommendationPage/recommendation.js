import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import HeaderBar from "../../components/header/HeaderBar";
import "./recommendation.css";

const RecommendationPage = () => {
    const { id } = useParams();
    const [recommendation, setRecommendation] = useState("Fetching recommendation...");

    useEffect(() => {
        const fetchRecommendation = async () => {
            try {
                const response = await axios.post("http://localhost:8000/api/full-recommendation", { clothing_id: id });
                setRecommendation(response.data.message);
            } catch (error) {
                console.error("❌ Error fetching recommendation:", error);
                setRecommendation("Failed to fetch recommendation.");
            }
        };

        fetchRecommendation();
    }, [id]);

    return (
        <div className="recommendation-container">
            <HeaderBar />
            <div className="recommendation-content">
                <h2>Recommendation</h2>
                <p>{recommendation}</p>
            </div>
        </div>
    );
};

export default RecommendationPage;
