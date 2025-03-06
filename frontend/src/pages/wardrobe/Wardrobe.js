import React from "react";
import ClothingList from "../../components/clothing-list/ClothingList";
import "./Wardrobe.css";
import HeaderBar from "../../components/header/HeaderBar";

function Wardrobe() {
  return (
    <div className="wardrobe-container">
      <HeaderBar />

      <ClothingList />
    </div>
  );
}

export default Wardrobe;
