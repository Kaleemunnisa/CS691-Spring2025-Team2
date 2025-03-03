const { fetchRealTimeWeather } = require("../services/weatherService");

exports.getWeather = async (req, res) => {
    try {
        const { location } = req.query;
        if (!location) {
            return res.status(400).json({ error: "⚠ Location is required" });
        }

        const temperature = await fetchRealTimeWeather(location);
        res.json({ location, temperature: `${temperature}°C` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
