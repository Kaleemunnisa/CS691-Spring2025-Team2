import React from "react";
import "./FirstIntroPage.css";
import FirstIntroImage from "./../../../assets/images/FirstIntroPage.png";
import { useNavigate } from "react-router-dom";

const FirstIntroPage = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/secondIntro");
  };

  const handleClose = () => {
    navigate("/login");
  };

  return (
    <div className="container">
      <button className="close-button" onClick={handleClose}>
        X
      </button>

      <img src={FirstIntroImage} alt="FirstIntroPage" />

      <h2 className="intro-text">Real-Time Weather Forecast</h2>

      <div className="progress-bar">
        <progress value={0.3} />
      </div>

      <button className="next-button" onClick={handleNext}>
        Next
      </button>
    </div>
  );
};

export default FirstIntroPage;
