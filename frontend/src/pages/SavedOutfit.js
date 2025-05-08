import React, { useState, useEffect } from "react";
import HeaderBar from "../components/header/HeaderBar";
import "./SavedOutfit.css";

const SavedOutfitsPage = () => {
    const [savedOutfits, setSavedOutfits] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("savedOutfits")) || [];
        setSavedOutfits(saved);
    }, []);

    const deleteOutfit = (timestamp) => {
        const updated = savedOutfits.filter(o => o.timestamp !== timestamp);
        setSavedOutfits(updated);
        localStorage.setItem("savedOutfits", JSON.stringify(updated));
    };

    return (
        <div className="saved-outfits-container">
            <HeaderBar />
            <div className="saved-outfits-content">
                <h2 className="rec-title">Saved Outfits</h2>

                {savedOutfits.length === 0 ? (
                    <p>No saved outfits yet.</p>
                ) : (
                    savedOutfits.map((entry, idx) => (
                        <div key={entry.timestamp} className="recommendation-box">
                            

                            <div className="card-grid">
                                <div className="item-card">
                                    <div className="section-label">Your Upload</div>
                                    <img src={entry.data.base_item.image} alt="Base item" />
                                    <div className="item-title">{entry.data.base_item.type}</div>
                                    <div className="item-color">{entry.data.base_item.color}</div>
                                </div>

                                {entry.data.recommendations.map((item, index) => (
                                    <div key={index} className="item-card">
                                        <div className="section-label">Recommended</div>
                                        <img src={item.image_url} alt={item.clothing_classification} />
                                        <div className="item-title">{item.clothing_classification}</div>
                                        <div className="item-color">{item.detected_color}</div>
                                    </div>
                                ))}
                            </div>

                            <button onClick={() => deleteOutfit(entry.timestamp)} className="save-button">Delete</button>
                        </div>
                    ))
                )}
            </div>
        </div>

    );
};

export default SavedOutfitsPage;
