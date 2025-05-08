const axios = require("axios");
require("dotenv").config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

async function fetchRealTimeWeather(lat, lon) {
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );

        if (!response.data || !response.data.main) {
            throw new Error("⚠ No weather data found");
        }

        return response.data.main.temp;
    } catch (error) {
        console.error("❌ Weather API Error:", error.message);
        return "Unknown";
    }
}

module.exports =  fetchRealTimeWeather ;
