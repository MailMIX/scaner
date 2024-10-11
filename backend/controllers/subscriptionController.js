const Subscription = require('../models/subscription');
const User = require('../models/user');

// Добавление подписки к пользователю
exports.add = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Создание новой подписки
    const newSubscription = new Subscription(req.body);
    await newSubscription.save();

    // Добавление подписки к пользователю
    user.subscriptions.push(newSubscription._id); // Добавляем ID подписки
    await user.save();

    res.json({ subscription: newSubscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Получение всех подписок пользователя
exports.get = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Получаем подписки по ID, которые хранятся в массиве пользователя
    const subscriptions = await Subscription.find({ _id: { $in: user.subscriptions } });

    res.json({ subscriptions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ... (Добавьте другие функции для управления подписками)