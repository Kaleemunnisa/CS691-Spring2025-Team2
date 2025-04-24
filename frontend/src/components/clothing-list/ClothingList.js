import React, { useEffect, useState } from "react";
import "./ClothingList.css";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ClothingList() {
  const [clothingItems, setClothingItems] = useState([]);
  const [likedItems, setLikedItems] = useState({});
  const [showFavorites, setShowFavorites] = useState(false);

  const navigate = useNavigate();

  // Fetch clothing items from the server before rendering
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

  // Toggle like status
  const toggleLike = (id) => {
    setLikedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // Confirm before deleting the item
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

  // Delete the item
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

  // Go to details page for this item
  const handleEdit = (item) => {
    navigate(`/details/${item._id}`, {
      state: {
        image_url: item.image_url,
        clothing_classification: item.clothing_classification,
        detected_color: item.detected_color,
        saved_clothing_id: item._id,
      },
    });
  };

  return (
    <div className="wardrobe-container">
      <h1 className="wardrobe-heading">My Wardrobe</h1>

      <button
        className="toggle-favorites-btn"
        onClick={() => setShowFavorites((prev) => !prev)}
      >
        {showFavorites ? "Show All Items" : "Show Favorites"}
      </button>

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
              <button className="edit-icon" onClick={() => handleEdit(item)}>
                <FaEdit />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClothingList;
