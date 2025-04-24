import React, { useEffect, useState } from "react";
import "./ClothingList.css";

const USER_ID = "user123";

function FavoriteList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const userRes = await fetch(`/api/fav/user/one?user_id=${USER_ID}`);
        const userData = await userRes.json();
        const favIds = userData.favorites || [];

        if (!favIds.length) {
          setItems([]);
          setLoading(false);
          return;
        }

        const clothRes = await fetch("/api/clothing/by-ids", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: favIds, user_id: USER_ID }),
        });
        const clothing = await clothRes.json();
        setItems(clothing);
      } catch (err) {
        console.error("Favorite gallery error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading favorites…</p>;

  if (!items.length)
    return (
      <p>
        No favorites found for <strong>{USER_ID}</strong>.
      </p>
    );

  return (
    <div className="gallery">
      {items.map((c) => (
        <img
          key={c._id}
          src={c.image_url}
          alt={c.clothing_classification}
          className="gallery-img"
        />
      ))}
    </div>
  );
}

export default FavoriteList;
