function recommendItemsByTypeAndWeather(type, temperature) {
  type = type.toLowerCase();

  const baseOptions = {
    top: ["shirt", "tshirt"],
    bottom: ["pant", "jeans"],
    outerwear: ["jacket", "coat"]
  };

  if (type === "outerwear" && temperature >= 15) return [];

  return baseOptions[type] || [];
}

function inferMissingItems(baseType, temperature) {
  const base = baseType.toLowerCase();
  const missing = [];

  if (["pant", "jeans"].includes(base)) {
    missing.push("top");
    if (temperature < 15) {
      missing.push("outerwear"); 
    }
  } else if (["tshirt", "shirt"].includes(base)) {
    missing.push("bottom");
    if (temperature < 15) {
      missing.push("outerwear"); 
    }
  } else if (["jacket", "coat"].includes(base)) {
    missing.push("top", "bottom"); 
  }

  return missing;
}


const colorCombinations = {
    red: ["white", "black", "navy blue"],
    blue: ["white", "beige", "light gray"],
    green: ["brown", "beige", "white"],
    yellow: ["navy blue", "black", "white"],
    black: ["white", "gray", "red"],
    white: ["black", "blue", "green"],
    orange: ["white", "black", "gray"],
    pink: ["white", "gray", "black"],
    cyan: ["white", "black", "gray"],
    purple: ["black", "gray", "white"],
    beige: ["black", "blue", "gray"],
    gray: ["black", "white", "blue"]
};

function buildRecommendationPlan(baseItem, temperature) {
  const baseType = baseItem.clothing_classification.toLowerCase();
  const missingTypes = inferMissingItems(baseType, temperature);
  const contrastColors = colorCombinations[baseItem.detected_color.toLowerCase()] || ["black", "beige"];

  return missingTypes.map(type => ({
    type,
    options: recommendItemsByTypeAndWeather(type, temperature),
    acceptableColors: contrastColors
  }));
}

module.exports = {
  buildRecommendationPlan,
  colorCombinations
};
