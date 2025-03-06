import React from "react";
import "./Menu.css";
import { IoArrowBackCircleSharp } from "react-icons/io5";

function Menu({ isOpen, onClose }) {
  return (
    <div className={`menu-popup ${isOpen ? "open" : ""}`}>
      <button className="close-button" onClick={onClose}>
        <IoArrowBackCircleSharp />
      </button>

      <button className="menu-item">Edit Profile</button>
      <button className="menu-item">Tutorial</button>
      <button className="menu-item">Frequently Asked Questions</button>
      <button className="menu-item">Blogs</button>
      <button className="menu-item">About Us</button>
    </div>
  );
}

export default Menu;
