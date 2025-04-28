import React from "react";
import ClothingList from "../../components/clothing-list/ClothingList";
import HeaderBar from "../../components/header/HeaderBar";
import { useLocation } from "../../context/LocationContext";

function Wardrobe() {
  const { locationData } = useLocation();

  console.log("👕 Wardrobe.jsx > global locationData:", locationData);

  return (
    <div>
      <HeaderBar />
      <ClothingList weatherData={locationData} />
    </div>
  );
}

export default Wardrobe;
