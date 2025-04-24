const fetchRealTimeWeather = require('../services/weatherService');
const { buildRecommendationPlan } = require('../services/outfitService');
const Clothing = require('../models/clothingModel');
const FALLBACK_BASE_URL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/fallbacks`;


exports.getRecommendation = async (req, res) => {
  try {
    const { userId, clothingId, lat, lon } = req.query;
    
    if (!userId || !clothingId || !lat || !lon) {
      return res.status(400).json({ error: 'userId, clothingId, lat, and lon are required.' });
    }
    // 1. Get current weather
    const temperature = await fetchRealTimeWeather(lat, lon);

    // 2. Get base clothing item
    const baseItem = await Clothing.findById(clothingId);
    if (!baseItem) {
      return res.status(404).json({ error: 'Uploaded clothing item not found.' });
    }

    // 3. Get entire wardrobe
    const wardrobe = await Clothing.find({ user_id: userId });

    // 4. Build flexible recommendation plan
    const recommendationPlan = buildRecommendationPlan(baseItem, temperature);

    const recommendations = [];
    const missing = [];

    const fallbackColors = ["white", "gray", "black", "beige", "blue"]; // relaxed neutrals

    for (const rec of recommendationPlan) {
      console.log(`🔁 Matching for type: ${rec.type}`);
      console.log(`    Options: ${rec.options}`);
      console.log(`    Acceptable Colors: ${rec.acceptableColors}`);
      
      const match = wardrobe.find(item => {
        const itemType = item.clothing_classification?.toLowerCase();
        const itemColor = item.detected_color?.toLowerCase();
        const typeMatch = rec.options.map(opt => opt.toLowerCase()).includes(itemType);
        const colorMatch = rec.acceptableColors.map(c => c.toLowerCase()).includes(itemColor);

        console.log(`    🧪 Trying item: ${itemType} — ${itemColor}`);
        console.log(`    ✅ Type match: ${typeMatch}, Color match: ${colorMatch}`);

        return typeMatch && colorMatch;
      });

      if (match) {
        recommendations.push(match);
      } else {
        console.log(`⚠️ No perfect match found for type=${rec.type}. Trying secondary fallback colors...`);
      
        // 🟡 Try relaxed fallback color palette
        const softMatch = wardrobe.find(item => {
          const itemType = item.clothing_classification?.toLowerCase();
          const itemColor = item.detected_color?.toLowerCase();
          const typeMatch = rec.options.map(opt => opt.toLowerCase()).includes(itemType);
          const colorMatch = fallbackColors.includes(itemColor);
          return typeMatch && colorMatch;
        });
      
        if (softMatch) {
          console.log(`🟢 Found relaxed fallback match for type=${rec.type}`);
          recommendations.push(softMatch);
        } else {
          console.log(`🔴 No match for type=${rec.type}, using hard fallback image.`);
      
          const fallback = {
            clothing_classification: rec.options[0],
            detected_color: "black",
            image_url: `${FALLBACK_BASE_URL}/black_${rec.options[0].toLowerCase()}.png`,
            fallback: true
          };
          recommendations.push(fallback);
        }
      }      
    }

    res.json({
      temperature,
      base_item: {
        type: baseItem.clothing_classification,
        color: baseItem.detected_color,
        image: baseItem.image_url,
      },
      recommendations,
      missing
    });

  } catch (error) {
    console.error('❌ Recommendation Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
