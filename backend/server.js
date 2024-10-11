const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const crypto = require('crypto'); //  Импортируйте  crypto
const ccxt = require('ccxt'); //  Импортируйте  CCXT

//  Загрузить  конфигурацию  из  .env
dotenv.config(); 

//  Создать  приложение  Express
const app = express();

//  Настроить  CORS  для  разрешения  запросов  из  фронтенда
app.use(cors({
    origin: 'https://fansvor.ru' //  URL  вашего  фронтенда 
  })); 

//  Парсер  JSON  для  запросов
app.use(bodyParser.json());
  
//  Функция  для  генерации  случайного  токена
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

//  Задайте  process.env.JWT_SECRET
process.env.JWT_SECRET = generateToken(); 

//  Подключение  к  MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Контроллеры (Controllers) ---
// Импортируйте контроллеры
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const subscriptionController = require('./controllers/subscriptionController'); 

// --- Маршруты (Routes) ---
// Импортируйте маршруты
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const scannerRoutes = require('./routes/scannerRoutes.js'); // Добавьте маршрут для сканера

// --- Использование Маршрутов ---
// Используйте маршруты
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/subscriptions', subscriptionRoutes); 
app.use('/api/scanner', scannerRoutes); // Добавьте маршрут для сканера

app.get('/', (req, res) => {
    res.send('Backend is running!'); // Возвращаем сообщение 
  });

// --- Запуск сервера ---
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});