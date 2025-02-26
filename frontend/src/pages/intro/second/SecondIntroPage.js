import React from "react";
import "./SecondIntroPage.css";
import SecondIntroImage from "./../../../assets/images/SecondIntroPage.png";
import { useNavigate } from "react-router-dom";

const SecondIntroPage = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/thirdIntro");
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
        className="second-intro-img"
        src={SecondIntroImage}
        alt="Second Intro Page"
      />

      <h2 className="intro-text">Your Digital Closet</h2>

      <div className="progress-bar">
        <progress value={0.5} />
      </div>

      <button className="next-button" onClick={handleNext}>
        Next
      </button>
    </div>
  );
};

export default SecondIntroPage;
