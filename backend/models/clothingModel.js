const mongoose = require("mongoose");

const ClothingSchema = new mongoose.Schema({
    image_url: { type: String, required: true },
    user_id: { type: String, required: true },
    clothing_classification: { type: String, required: true },
    detected_color: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Clothing = mongoose.model("Clothing", ClothingSchema);

module.exports = Clothing;
