const { classifyClothing, detectPrimaryColor } = require("../services/visionService");
const Clothing = require("../models/clothingModel");

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
exports.classifyClothingItem = async (req, res) => {
    try {
        const { image_id, image_url, user_id } = req.body;
        if (!image_id || !image_url || !user_id) {
            return res.status(400).json({ error: "Image ID, Image URL, and user_id are required" });
        }

        console.log("🟢 Step 1: Identifying clothing...");
        let clothingRaw = await classifyClothing(image_url);
        const clothing = capitalize(clothingRaw);  // Normalize

        console.log("🟢 Step 2: Detecting primary color...");
        let detectedColor = await detectPrimaryColor(image_url);
        detectedColor = detectedColor.toLowerCase();  // Normalize

        // Store the classification result in database
        const newClothing = new Clothing({
            image_id,
            image_url,
            user_id,
            clothing_classification: clothing,
            detected_color: detectedColor
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


exports.getAllClothingByUser = async (req, res) => {
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

// Get Clothing Details by ID
exports.getClothingDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const clothing = await Clothing.findById(id);

        if (!clothing) {
            return res.status(404).json({ error: "Clothing item not found" });
        }

        res.json(clothing);
    } catch (error) {
        console.error("❌ Error fetching clothing details:", error.message);
        res.status(500).json({ error: "Failed to retrieve clothing details" });
    }
};

exports.editClothing = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = {
            ...req.body,
            status: "classified"
          };

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
