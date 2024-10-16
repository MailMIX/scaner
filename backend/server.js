const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const crypto = require('crypto');

dotenv.config();

const app = express();
app.use(cors({ origin: 'https://fansvor.ru' }));
app.use(bodyParser.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB...');
  })
  .catch(error => console.error('Ошибка подключения к MongoDB:', error));

// --- Контроллеры (Controllers) ---
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const subscriptionController = require('./controllers/subscriptionController');

// --- Маршруты (Routes) ---
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const scannerRoutes = require('./routes/scannerRoutes');

// --- Использование Маршрутов ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/scanner', scannerRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running!'); // Возвращаем сообщение
});

// --- Запуск сервера ---
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});