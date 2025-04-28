const mongoose = require("mongoose");
const User = require("../models/userModel");
const Clothing = require("../models/clothingModel");

exports.getFavorites = async (req, res) => {
  // retrieve user_id from query parameters
  const { user_id } = req.query;
  try {
    const user = await User.findOne(
      { User_ID: user_id },
      { favorites: 1, _id: 0 }
    ).lean();

    res.json(user?.favorites?.map((id) => id.toString()) || []);
  } catch (err) {
    console.error("getFavorites error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addFavorite = async (req, res) => {
  const { user_id, clothing_id } = req.body;
  const user = await User.findOneAndUpdate(
    { User_ID: user_id },
    { $addToSet: { favorites: new mongoose.Types.ObjectId(clothing_id) } },
    { new: true, upsert: true }
  ).lean();
  res.json(user.favorites);
};

exports.removeFavorite = async (req, res) => {
  const { user_id, clothing_id } = req.body;
  const user = await User.findOneAndUpdate(
    { User_ID: user_id },
    { $pull: { favorites: new mongoose.Types.ObjectId(clothing_id) } },
    { new: true }
  ).lean();
  res.json(user.favorites);
};

exports.getFavoriteClothing = async (req, res) => {
  const { user_id } = req.query;
  try {
    const user = await User.findOne({ User_ID: user_id }).lean();
    if (!user || !user.favorites.length) return res.json([]);

    const items = await Clothing.find({
      _id: { $in: user.favorites },
      user_id, // lowercase field in Clothing docs
    }).lean();

    res.json(items);
  } catch (err) {
    console.error("getFavoriteClothing error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
