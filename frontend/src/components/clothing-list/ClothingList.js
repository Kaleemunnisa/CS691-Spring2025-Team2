import React, { useEffect, useState } from "react";
import "./ClothingList.css";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";

function ClothingList() {
  const [clothingItems, setClothingItems] = useState([]);
  const [likedItems, setLikedItems] = useState({});

  useEffect(() => {
    fetch("/api/clothing/get-clothing?user_id=user123")
      .then((response) => response.json())
      .then((data) => {
        setClothingItems(data);

        const initialLikedState = {};
        data.forEach((item) => {
          initialLikedState[item._id] = false;
        });
        setLikedItems(initialLikedState);
      })
      .catch((error) => console.error("Error fetching clothing:", error));
  }, []);

  const toggleLike = (id) => {
    setLikedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div className="wardrobe-grid">
      {clothingItems.map((item) => (
        <div key={item._id} className="wardrobe-item">
          <img
            src={item.image_url}
            alt={item.clothing_classification}
            className="clothing-image"
          />
          <button className="heart-icon" onClick={() => toggleLike(item._id)}>
            {likedItems[item._id] ? (
              <IoMdHeart color="red" />
            ) : (
              <IoMdHeartEmpty />
            )}
          </button>

          <div className="clothing-info">
            <p className="clothing-name">{item.clothing_classification}</p>
            <p className="clothing-class">Color: {item.detected_color}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ClothingList;
