// **Weather-based Outfit Recommendation**
function recommendOutfit(clothing, temperature) {
    if (temperature < 5) return ["Heavy Jacket", "Thermal Layers", "Gloves", "Boots"];
    if (temperature < 10) return ["Sweater", "Light Jacket", "Jeans"];
    if (temperature < 15) return ["Hoodie", "Pants", "Sneakers"];
    if (temperature < 20) return ["Long Sleeves", "Jeans"];
    if (temperature < 25) return ["T-Shirt", "Light Pants"];
    return ["T-Shirt", "Shorts", "Sandals"];
}

// **Color Matching for Outfit Suggestions**
const colorCombinations = {
    "red": ["white", "black", "navy blue"],
    "blue": ["white", "beige", "light gray"],
    "green": ["brown", "beige", "white"],
    "yellow": ["navy blue", "black", "white"],
    "black": ["white", "gray", "red"],
    "white": ["black", "blue", "green"],
    "orange": ["white", "black", "gray"],
    "pink": ["white", "gray", "black"],
    "cyan": ["white", "black", "gray"],
    "purple": ["black", "gray", "white"],
    "beige": ["black", "blue", "gray"],
    "gray": ["black", "white", "blue"]
};

module.exports = { recommendOutfit, colorCombinations };
