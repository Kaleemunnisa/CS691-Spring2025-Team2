import React from "react";
import "./Menu.css";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function Menu({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    onClose(); // close menu after navigating
  };

  return (
    <div className={`menu-popup ${isOpen ? "open" : ""}`}>
      <button className="close-button" onClick={onClose}>
        <IoArrowBackCircleSharp />
      </button>

      <button className="menu-item" onClick={() => handleNavigation("/edit-profile")}>Edit Profile</button>
      <button className="menu-item" onClick={() => handleNavigation("/tutorial")}>Tutorial</button>
      <button className="menu-item" onClick={() => handleNavigation("/faq")}>Frequently Asked Questions</button>
      <button className="menu-item" onClick={() => handleNavigation("/blogs")}>Blogs</button>
      <button className="menu-item" onClick={() => handleNavigation("/about")}>About Us</button>
    </div>
  );
}

export default Menu;
