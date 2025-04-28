import React from "react";
import HeaderBar from "../../components/header/HeaderBar";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-page-container">
      <HeaderBar />
      <div className="about-container">
        <h1>About Us</h1>
        <p>
          We’re a team of passionate developers working on a smart, weather-based clothing recommendation system as part of our CS691 Spring 2025 course.
          Our mission is to blend AI and fashion for everyday ease. From wardrobe uploads to personalized outfit suggestions — VogueMind helps you dress smarter.
        </p>
        <p>
          This project reflects our interdisciplinary spirit, where tech meets creativity to deliver a daily-life utility that's practical, adaptive, and fun.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
