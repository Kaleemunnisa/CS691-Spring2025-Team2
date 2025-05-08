const { recommendOutfit, colorCombinations } = require("../services/outfitService");
const Clothing = require("../models/clothingModel");

exports.getFullRecommendation = async (req, res) => {
    try {
        const { clothing_id, temperature } = req.body;
        if (!clothing_id || temperature === undefined) {
            return res.status(400).json({ error: "Clothing ID and temperature are required" });
        }

        console.log("🟢 Fetching stored clothing details...");
        const clothingData = await Clothing.findById(clothing_id);

        if (!clothingData) {
            return res.status(404).json({ error: "Clothing item not found" });
        }

        console.log("🟢 Step 3: Matching outfit...");
        let outfit = recommendOutfit(clothingData.clothing_classification, temperature);

        console.log("🟢 Step 4: Matching colors...");
        const recommendedColors = colorCombinations[clothingData.detected_color] || ["black", "white"];

        // Update the database with recommendations
        clothingData.recommended_outfit = outfit;
        clothingData.matching_colors = recommendedColors;
        clothingData.temperature = temperature;
        await clothingData.save();

        const finalStatement = `Based on the weather forecast of ${temperature}°C, we recommend pairing a ${clothingData.clothing_classification} with ${outfit.join(", ")}. Since your clothing has the color ${clothingData.detected_color}, we suggest pairing it with: ${recommendedColors.join(", ")}.`;

        res.json({
            clothing_classification: clothingData.clothing_classification,
            temperature: `${temperature}°C`,
            recommended_outfit: outfit,
            detected_color: clothingData.detected_color,
            matching_colors: recommendedColors,
            final_statement: finalStatement,
            saved_clothing_id: clothingData._id
        });
    } catch (error) {
        console.error("❌ Recommendation API Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};
