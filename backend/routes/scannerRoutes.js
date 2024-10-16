const express = require('express');
const router = express.Router();
const scannerController = require('../controllers/scannerController');

// Определите маршрут для получения самых прибыльных пар
router.get('/', scannerController.collectAndSendData);

module.exports = router;