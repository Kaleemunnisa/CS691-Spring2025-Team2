import React from "react";
import "./ThirdIntroPage.css";
import ThirdIntroImage from "./../../../assets/images/ThirdIntroPage.png";
import { useNavigate } from "react-router-dom";

const ThirdIntroPage = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/wardrobe");
  };

  const handleClose = () => {
    navigate("/login");
  };

  return (
    <div className="container">
      <button className="close-button" onClick={handleClose}>
        X
      </button>

      <img
        className="third-intro-img"
        src={ThirdIntroImage}
        alt="SecondIntroPage"
      />

      <h2 className="intro-text">Trending Styles For Any Weather Condition</h2>

      <div className="progress-bar">
        <progress value={1} />
      </div>

      <button className="next-button" onClick={handleNext}>
        Next
      </button>
    </div>
  );
};

export default ThirdIntroPage;
