const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    image_url: { type: String, required: true },
    user_id: { type: String, required: true },
    uploaded_at: { type: Date, default: Date.now },
    status: { 
        type: String, 
        enum: ['pending', 'classified', 'failed'], 
        default: 'pending' 
    },
});

module.exports = mongoose.model("Image", ImageSchema);
