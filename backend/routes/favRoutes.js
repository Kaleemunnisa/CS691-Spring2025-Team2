import express from "express";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  getFavoriteClothing,
} from "../controllers/favController.js";

const router = express.Router();

router.get("/get-favorites", getFavorites);
router.post("/add-favorite", addFavorite);
router.delete("/remove-favorite", removeFavorite);
router.get("/get-favorite-clothing", getFavoriteClothing);

export default router;
