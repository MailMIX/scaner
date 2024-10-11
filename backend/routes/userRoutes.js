const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

//  Проверка  JWT  (middleware)
router.use(authMiddleware); 

// Обновление профиля
router.put('/update', userController.update);

module.exports = router;