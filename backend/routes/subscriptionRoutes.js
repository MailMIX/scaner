const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');

//  Проверка  JWT  (middleware)
router.use(authMiddleware); 

// Добавление подписки
router.post('/add', subscriptionController.add);
// Получение подписок
router.get('/get', subscriptionController.get);

module.exports = router;