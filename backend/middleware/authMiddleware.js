const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', ''); //  Извлекаем  токен  из  заголовка
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //  Проверяем  токен  

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error();
    }

    req.user = user; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Неавторизован' });
  }
};

module.exports = authMiddleware;