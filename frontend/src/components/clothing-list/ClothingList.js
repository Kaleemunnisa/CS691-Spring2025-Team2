import React, { useEffect, useState } from "react";
import "./ClothingList.css";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

function ClothingList() {
  const [clothingItems, setClothingItems] = useState([]);
  const [likedItems, setLikedItems] = useState({});

  const [editItemId, setEditItemId] = useState(null);
  const [editData, setEditData] = useState({});

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

  const startEdit = (item) => {
    setEditItemId(item._id);
    setEditData({
      clothing_classification: item.clothing_classification,
      detected_color: item.detected_color,
    });
  };

  // Update the edited item
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Save the edited item
  const saveEdit = (id) => {
    fetch(`/api/clothing/edit-clothing/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editData),
    })
      .then((response) => response.json())
      .then((updatedItem) => {
        setClothingItems((prevItems) =>
          prevItems.map((item) => (item._id === id ? updatedItem : item))
        );
        setEditItemId(null);
      })
      .catch((error) => console.error("Error updating item:", error));
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
            {editItemId === item._id ? (
              <>
                <input
                  type="text"
                  name="clothing_classification"
                  value={editData.clothing_classification}
                  onChange={handleEditChange}
                  className="edit-input"
                />
                <input
                  type="text"
                  name="detected_color"
                  value={editData.detected_color}
                  onChange={handleEditChange}
                  className="edit-input"
                />
                <button
                  className="save-button"
                  onClick={() => saveEdit(item._id)}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <p className="clothing-name">{item.clothing_classification}</p>
                <p className="clothing-class">Color: {item.detected_color}</p>
                <button className="edit-icon" onClick={() => startEdit(item)}>
                  <FaEdit />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ClothingList;
