import React from "react";
import "./Navbar.css";
import logo from "../assets/images/logo.png";

const Navbar = () => {

    return (
        <div className="navbar">
            <a href="/"><img src={logo} alt="App Logo" className="nav-logo" /></a>
        </div>
    );
};

export default Navbar;
