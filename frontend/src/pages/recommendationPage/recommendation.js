import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation as useGlobalLocation } from "../../context/LocationContext";
import HeaderBar from "../../components/header/HeaderBar";
import "./recommendation.css";

const RecommendationPage = () => {
  const { id } = useParams();
  const { locationData } = useGlobalLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const lat = locationData.lat || 40.71;
  const lon = locationData.lon || -74.01;
  const tempOverride = locationData.temperature;

  const saveOutfit = () => {
    const saved = JSON.parse(localStorage.getItem("savedOutfits")) || [];
    const newSave = {
      timestamp: Date.now(),
      data: data
    };
    localStorage.setItem("savedOutfits", JSON.stringify([...saved, newSave]));
    navigate("/outfits");
  };

  useEffect(() => {
    console.log("📦 Fetching recommendation with lat/lon/temp:", lat, lon, tempOverride);

    const fetchRecommendation = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/recommendation`, {
          params: {
            userId: "user123",
            clothingId: id,
            lat,
            lon
          }
        });

        const result = response.data;

        // Override temperature if available
        if (tempOverride !== undefined && tempOverride !== null) {
          result.temperature = parseFloat(tempOverride);
        }

        setData(result);
      } catch (err) {
        console.error("❌ Error fetching recommendation:", err);
        setError("Failed to fetch recommendation.");
      }
    };

    fetchRecommendation();
  }, [id, lat, lon, tempOverride]);

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
              🌡️ {data.temperature ? `${data.temperature.toFixed(1)}°C` : "N/A"}
            </div>

            <div className="card-grid">
              <div className="item-card">
                <div className="section-label">Your Upload</div>
                <img src={data.base_item.image} alt="Base item" />
                <div className="item-title">{data.base_item.type}</div>
                <div className="item-color">{data.base_item.color}</div>
              </div>

              {data.recommendations.map((item, index) => (
                <div key={index} className="item-card">
                  <div className="section-label">Recommended</div>
                  <img src={item.image_url} alt={item.clothing_classification} />
                  <div className="item-title">{item.clothing_classification}</div>
                  <div className="item-color">{item.detected_color}</div>
                </div>
              ))}

              <button onClick={saveOutfit} className="save-button">Save Outfit</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecommendationPage;
