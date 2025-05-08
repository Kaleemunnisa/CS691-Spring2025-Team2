const express = require("express");
const { getFullRecommendation } = require("../controllers/aiController");

const router = express.Router();

router.post("/full-recommendation", getFullRecommendation);

module.exports = router;
