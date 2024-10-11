const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');  //  Удаляем  импорт

//  Проверка  JWT  (middleware)
// router.use(authMiddleware); //  Удаляем  middleware 

//  Регистрация  нового  пользователя
router.post('/register', authController.register); //  Добавляем  маршрут  для  регистрации

router.post('/login', authController.login); 

router.get('/me', authMiddleware, authController.me); 

module.exports = router;