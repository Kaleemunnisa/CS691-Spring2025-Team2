const fetchRealTimeWeather = require("../services/weatherService");

exports.getWeather = async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ error: "Latitude and Longitude are required" });
        }

        const temperature = await fetchRealTimeWeather(lat, lon);
        res.json({ temperature: `${temperature}°C` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
