import React from "react";
import "./HeaderBar.css";
import logo from "../../assets/images/logo.png";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import Menu from "../menu/Menu";
import { useState } from "react";

function HeaderBar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="header-container">
      <div className="header-nav">
        <button className="nav-button" onClick={() => navigate(-1)}>
          <IoArrowBackCircleSharp />
        </button>

        <a href="/home"><img src={logo} alt="Wardrobe Logo" className="logo" /></a>

        <button className="nav-button" onClick={() => setIsMenuOpen(true)}>
          <GiHamburgerMenu />
        </button>
      </div>

      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}

export default HeaderBar;
