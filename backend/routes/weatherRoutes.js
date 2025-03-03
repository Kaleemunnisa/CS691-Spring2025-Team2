const express = require("express");
const { getWeather } = require("../controllers/weatherController");

const router = express.Router();

router.get("/fetch-weather", getWeather);

module.exports = router;
