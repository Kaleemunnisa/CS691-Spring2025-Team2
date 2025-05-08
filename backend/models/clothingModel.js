const mongoose = require('mongoose');

const ClothingSchema = new mongoose.Schema({
    image_id: { type: mongoose.Schema.Types.ObjectId, ref: "Image", required: true },
    image_url: { type: String, required: true }, // Added to keep track
    user_id: { type: String, required: true },
    clothing_classification: { type: String, required: true },
    detected_color: { type: String, required: true },
    status: {
        type: String,
        enum: ['classified', 'pending'],
        default: 'classified'
    },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Clothing", ClothingSchema);
