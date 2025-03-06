import React, { useEffect, useState } from "react";
import "./ClothingList.css";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";

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

  const confirmDelete = (id) => {
    const item = clothingItems.find((item) => item._id === id);
    if (
      window.confirm(
        `Are you sure you want to delete "${item.clothing_classification}"?`
      )
    ) {
      deleteItem(id);
    }
  };

  const deleteItem = (id) => {
    fetch(`/api/clothing/delete-clothing/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setClothingItems((prevItems) =>
            prevItems.filter((item) => item._id !== id)
          );
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => console.error("Error deleting item:", error));
  };

  return (
    <div className="wardrobe-grid">
      {clothingItems.map((item) => (
        <div key={item._id} className="wardrobe-item">
          <button
            className="delete-icon"
            onClick={() => confirmDelete(item._id)}
          >
            <MdDeleteOutline />
          </button>

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
