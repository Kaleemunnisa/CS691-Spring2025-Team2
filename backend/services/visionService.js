const vision = require("@google-cloud/vision");
const ColorNamer = require("color-namer");

const visionClient = new vision.ImageAnnotatorClient();

const colorMap = {
  red: /red|maroon|crimson/,
  blue: /blue|navy|steelblue|sky/,
  green: /green|olive|mint/,
  yellow: /yellow|gold/,
  orange: /orange|amber/,
  black: /black|slategray|charcoal|darkgray|darkgrey|darkslate/,
  white: /white|ivory|snow|ghost|mintcream/,
  gray: /gray|grey|silver|gainsboro|lightgrey|lightgray|ash|slate/,
  pink: /pink|fuchsia|rose/,
  purple: /purple|violet|lavender/,
  beige: /beige|tan|khaki|peach|linen/,
  brown: /brown|chocolate|sienna|mocha|coffee|walnut/
};

function mapToFixedCategory(visionLabels) {
  const labelText = visionLabels.map(label => label.description.toLowerCase()).join(" ");

  if (/t[\s-]?shirt/.test(labelText)) return "tshirt";
  if (/\bshirt\b/.test(labelText)) return "shirt";
  if (/\bpants?\b|\btrousers?\b/.test(labelText)) return "pant";
  if (/\bjeans?\b/.test(labelText)) return "jeans";
  if (/\bjacket\b/.test(labelText)) return "jacket";
  if (/\bcoat\b/.test(labelText)) return "coat";

  return "unknown";
}

async function classifyClothing(image_url) {
  try {
    const [result] = await visionClient.labelDetection(image_url);
    const labels = result.labelAnnotations;

    if (!labels || labels.length === 0) return "unknown";
    return mapToFixedCategory(labels);
  } catch (error) {
    console.error("❌ Clothing Identification Error:", error.message);
    return "unknown";
  }
}

async function detectPrimaryColor(image_url) {
  try {
    const [colorResult] = await visionClient.imageProperties(image_url);
    const colors = colorResult.imagePropertiesAnnotation.dominantColors.colors;

    if (!colors || colors.length === 0) return "unknown";

    const filteredColors = colors.map(color => ({
      hex: `#${((1 << 24) + (color.color.red << 16) + (color.color.green << 8) + color.color.blue)
        .toString(16)
        .slice(1)
        .toUpperCase()}`,
      score: color.score
    }));

    filteredColors.sort((a, b) => b.score - a.score);
    const dominantColor = filteredColors[0];

    const colorName = ColorNamer(dominantColor.hex).html[0].name.toLowerCase();
    console.log(`🎨 Detected color name: ${colorName}`);

    for (const [basicColor, regex] of Object.entries(colorMap)) {
      if (regex.test(colorName)) {
        return basicColor;
      }
    }

    return "unknown";
  } catch (error) {
    console.error("❌ Color Detection Error:", error.message);
    return "unknown";
  }
}

module.exports = { classifyClothing, detectPrimaryColor };
