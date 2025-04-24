const express = require("express");
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  getFavoriteClothing,
} = require("../controllers/favController");

const router = express.Router();

router.get("/get-favorites", getFavorites);
router.post("/add-favorite", addFavorite);
router.delete("/remove-favorite", removeFavorite);
router.get("/get-favorite-clothing", getFavoriteClothing);

module.exports = router;
