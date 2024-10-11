const User = require('../models/user');

// Обновление профиля пользователя
exports.update = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, // ID пользователя из токена 
      req.body, 
      { new: true } // Возвращает обновленную версию
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json(updatedUser); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ... (Добавьте другие функции для управления пользователями)