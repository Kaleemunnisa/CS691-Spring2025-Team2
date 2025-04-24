const express = require('express');
const router = express.Router();
const { getRecommendation } = require('../controllers/recommendationController');

router.get('/recommendation', getRecommendation);

module.exports = router;
