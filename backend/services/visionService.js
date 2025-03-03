const vision = require("@google-cloud/vision");
const ColorNamer = require("color-namer");

const visionClient = new vision.ImageAnnotatorClient();

// **Clothing Identification**
async function classifyClothing(image_url) {
    try {
        const [result] = await visionClient.labelDetection(image_url);
        const clothingLabels = result.labelAnnotations
            .filter(label => 
                ["shirt", "t-shirt", "dress", "jacket", "jeans", "hoodie", "sweater", "coat"]
                .some(keyword => label.description.toLowerCase().includes(keyword))
            )
            .map(label => label.description);

        return clothingLabels.length > 0 ? clothingLabels[0] : "Unknown Clothing Item";
    } catch (error) {
        console.error("❌ Clothing Identification Error:", error.message);
        return "Unknown";
    }
}

// **Color Detection**
async function detectPrimaryColor(image_url) {
    try {
        const [colorResult] = await visionClient.imageProperties(image_url);
        const colors = colorResult.imagePropertiesAnnotation.dominantColors.colors;

        if (!colors || colors.length === 0) return "unknown";

        let filteredColors = colors.map(color => ({
            hex: `#${((1 << 24) + (color.color.red << 16) + (color.color.green << 8) + color.color.blue)
                .toString(16)
                .slice(1)
                .toUpperCase()}`,
            score: color.score
        }));

        filteredColors.sort((a, b) => b.score - a.score);
        let dominantColor = filteredColors[0];

        let colorName = ColorNamer(dominantColor.hex).html[0].name.toLowerCase();
        return colorName;
    } catch (error) {
        console.error("❌ Color Detection Error:", error.message);
        return "unknown";
    }
}

module.exports = { classifyClothing, detectPrimaryColor };
