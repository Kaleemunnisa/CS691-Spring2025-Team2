import User from "../models/userModel.js";
import Clothing from "../models/clothingModel.js";
import mongoose from "mongoose";

export const getFavorites = async (req, res) => {
  const { User_ID: user_id } = req.query;
  const user = await User.findOne({ User_ID: user_id });

  return res.json(user?.favorites?.map((id) => id.toString()) || []);
};

export const addFavorite = async (req, res) => {
  const { user_id, clothing_id } = req.body;
  const user = await User.findOneAndUpdate(
    { User_ID: user_id },
    { $addToSet: { favorites: new mongoose.Types.ObjectId(clothing_id) } },
    { new: true, upsert: true }
  );
  res.json(user.favorites);
};

export const removeFavorite = async (req, res) => {
  const { user_id, clothing_id } = req.body;
  const user = await User.findOneAndUpdate(
    { User_ID: user_id },
    { $pull: { favorites: new mongoose.Types.ObjectId(clothing_id) } },
    { new: true }
  );
  res.json(user.favorites);
};

export const getFavoriteClothing = async (req, res) => {
  const { user_id } = req.query;
  const user = await User.findOne({ User_ID: user_id });
  if (!user || !user.favorites.length) return res.json([]);

  const items = await Clothing.find({
    _id: { $in: user.favorites },
    user_id: user_id,
  });

  res.json(items);
};
