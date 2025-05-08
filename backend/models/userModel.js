const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    height: { type: Number },
    weight: { type: Number },
    skinTone: { type: String, enum: ["Fair", "Medium", "Dark"] }, // Standardized values
    profileImage: { type: String }, // Store profile image URL from S3
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Clothing" }],
    User_ID: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
