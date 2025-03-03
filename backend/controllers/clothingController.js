const { classifyClothing, detectPrimaryColor } = require("../services/visionService");
const Clothing = require("../models/clothingModel");

exports.classifyClothingItem = async (req, res) => {
    try {
        const { image_url, user_id } = req.body;
        if (!image_url || !user_id) {
            return res.status(400).json({ error: "Image URL and user_id are required" });
        }

        console.log("🟢 Step 1: Identifying clothing...");
        const clothing = await classifyClothing(image_url);

        console.log("🟢 Step 2: Detecting primary color...");
        let detectedColor = await detectPrimaryColor(image_url);
        detectedColor = detectedColor.toLowerCase();

        // Store the classification result in database
        const newClothing = new Clothing({
            image_url,
            user_id,
            clothing_classification: clothing,
            detected_color: detectedColor,
        });

        await newClothing.save();

        res.json({
            message: "Clothing classification completed successfully",
            clothing_classification: clothing,
            detected_color: detectedColor,
            saved_clothing_id: newClothing._id
        });
    } catch (error) {
        console.error("❌ Classification API Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};


exports.getClothingByUser = async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const clothingItems = await Clothing.find({ user_id });
        res.json(clothingItems);
    } catch (error) {
        console.error("❌ Error fetching clothing items:", error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.editClothing = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedClothing = await Clothing.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedClothing) {
            return res.status(404).json({ error: "Clothing item not found" });
        }

        res.json(updatedClothing);
    } catch (error) {
        console.error("❌ Error updating clothing item:", error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteClothing = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedClothing = await Clothing.findByIdAndDelete(id);

        if (!deletedClothing) {
            return res.status(404).json({ error: "Clothing item not found" });
        }

        res.json({ message: "Clothing item deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting clothing item:", error.message);
        res.status(500).json({ error: error.message });
    }
};
