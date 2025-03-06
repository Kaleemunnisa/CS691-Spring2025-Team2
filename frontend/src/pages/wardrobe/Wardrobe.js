import React from "react";
import ClothingList from "../../components/clothing-list/ClothingList";
import HeaderBar from "../../components/header/HeaderBar";

function Wardrobe() {
  return (
    <div>
      <HeaderBar />
      <ClothingList />
    </div>
  );
}

export default Wardrobe;
