const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt')

// Регистрация нового пользователя
exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Проверка, существует ли пользователь с таким именем или email
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким именем или email уже существует!' });
    }

    // Хэширование пароля перед сохранением
    const hashedPassword = await bcrypt.hash(password, 10); 

    // Создание нового пользователя
    const newUser = new User({ username, password: hashedPassword, email }); 
    await newUser.save();
    res.json({ message: 'Пользователь успешно зарегистрирован!' }); 
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body; //  Получаем  username  из  запроса
    const token = req.header('Authorization'); //  Получаем  токен  из  заголовка

    let user;
    if (token) {
      //  Проверяем  токен,  если  он  присутствует  в  запросе
      const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
      user = await User.findById(decoded.userId); 
    } else {
      //  Если  токена  нет,  проверяем  username  и  пароль
      user = await User.findOne({ username }); //  Ищем  пользователя  по  username
      if (!user) {
        return res.status(400).json({ message: 'Неверный логин' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Неверный пароль' });
      }
    }

    //  Создание  JWT-токена
    const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); 

    res.json({ message: 'Вход  выполнен  успешно!', token: newToken, user: user }); //  Возвращаем  user  в  ответе
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Получение данных текущего пользователя (после авторизации)
exports.me = async (req, res) => {
  try {
    res.json(req.user); // Отправляем данные пользователя
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ... (Добавьте другие функции, например, logout)