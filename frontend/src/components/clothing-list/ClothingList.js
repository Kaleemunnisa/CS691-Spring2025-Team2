import React, { useEffect, useState } from "react";
import "./ClothingList.css";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ClothingList() {
  const [clothingItems, setClothingItems] = useState([]);
  const [likedItems, setLikedItems] = useState({});
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const USER_ID = "user123";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClothingAndFavorites = async () => {
      try {
        const [clothingRes, favoritesRes] = await Promise.all([
          fetch(`/api/clothing/get-clothing?user_id=${USER_ID}`),
          fetch(`/api/fav/get-favorites?user_id=${USER_ID}`),
        ]);

        const clothingData = await clothingRes.json();
        const favorites = await favoritesRes.json();

        const likedMap = {};
        clothingData.forEach((item) => {
          likedMap[item._id] = favorites.includes(item._id);
        });

        setClothingItems(clothingData);
        setLikedItems(likedMap);
      } catch (error) {
        console.error("Error fetching clothing or favorites:", error);
      }
    };

    fetchClothingAndFavorites();
  }, []);

  const toggleLike = async (id) => {
    const isLiked = likedItems[id];

    setLikedItems((prev) => ({
      ...prev,
      [id]: !isLiked,
    }));

    const endpoint = isLiked
      ? "/api/fav/remove-favorite"
      : "/api/fav/add-favorite";

    try {
      const res = await fetch(endpoint, {
        method: isLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: USER_ID, clothing_id: id }),
      });

      const updatedFavorites = await res.json();
      const newLikedState = {};
      updatedFavorites.forEach((cid) => {
        newLikedState[cid] = true;
      });
      setLikedItems(newLikedState);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
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
          setLikedItems((prev) => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
          });
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => console.error("Error deleting item:", error));
  };

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

  const visibleItems = showOnlyFavorites
    ? clothingItems.filter((item) => likedItems[item._id])
    : clothingItems;

  const groupedItems = visibleItems.reduce((acc, item) => {
    const key = item.clothing_classification;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="wardrobe-container">
      <h1 className="wardrobe-heading">My Wardrobe</h1>

      <button
        className="toggle-favorites-btn"
        onClick={() => setShowOnlyFavorites((prev) => !prev)}
      >
        {showOnlyFavorites ? "Show All" : "Show Favorites"}
      </button>

      {Object.entries(groupedItems).map(([classification, items]) => (
        <div key={classification} className="classification-group">
          <h2 className="classification-heading">{classification}</h2>
          <div className="wardrobe-grid">
            {items.map((item) => (
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

                <button
                  className="heart-icon"
                  onClick={() => toggleLike(item._id)}
                >
                  {likedItems[item._id] ? (
                    <IoMdHeart color="red" />
                  ) : (
                    <IoMdHeartEmpty />
                  )}
                </button>

                <div className="clothing-info">
                  <p className="clothing-name">
                    {item.clothing_classification}
                  </p>
                  <p className="clothing-class">Color: {item.detected_color}</p>
                  <button
                    className="edit-icon"
                    onClick={() => handleEdit(item)}
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ClothingList;
