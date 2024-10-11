const express = require('express');
const router = express.Router();
const ccxt = require('ccxt');

// Список бирж
const exchanges = [
  'bybit', 'kucoin', 'bitget', 'bingx', 'mexc', 'okx', 'htx', 'gateio'
];

// Функция для получения данных с биржи
async function getExchangeData(exchangeName) {
  try {
    const exchange = new ccxt[exchangeName]();

    // Получение списка тикеров
    const tickers = await exchange.fetchTickers();
    // console.log(`Биржа: ${exchangeName}, Тикеры:`, tickers); // Вывод в консоль тикеров

    // Обработка тикеров
    const exchangeData = Object.entries(tickers).map(([symbol, ticker]) => ({
      exchange: exchangeName,
      symbol: symbol,
      price: ticker.last,
    }));

    // console.log(`Биржа: ${exchangeName}, Обработанные данные:`, exchangeData); // Вывод в консоль обработанных данных

    return exchangeData;
  } catch (error) {
    console.error(`Ошибка при получении данных с ${exchangeName}:`, error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
}

// Функция для получения информации о контракте и сетях
async function getContractData(exchangeName, symbol) {
  try {
    const exchange = new ccxt[exchangeName]();
    // Загрузка валют
    const currencies = await exchange.fetchCurrencies();
    // console.log(`Биржа: ${exchangeName}, Валюты:`, currencies); // Вывод в консоль валют

    // Получение данных о валюте
    const currency = currencies[symbol.split('/')[0]]; // Получаем валюту по символу
    // console.log(`Биржа: ${exchangeName}, Валюта:`, currency); // Вывод в консоль валюты

    return {
      contract: currency.info.contract,
      networks: currency.networks,
    };
  } catch (error) {
    console.error(`Ошибка при получении данных о контракте с ${exchangeName}:`, error);
    return null; // Возвращаем null в случае ошибки
  }
}

// Главная функция
async function main() {
  try {
    console.log('Начало обработки данных...'); 

    // Получаем данные со всех бирж
    const allData = [];
    for (const exchangeName of exchanges) {
      const exchangeData = await getExchangeData(exchangeName);
      allData.push(...exchangeData);
    }
    // console.log('Все данные со всех бирж:', allData); // Вывод в консоль всех данных

    console.log('Обработка завершена.'); // Добавлен вывод в консоль

    //  ... (Код для сортировки, проверки, фильтрации и добавления таймера) ...

    // Пример простой обработки
    const result = {}; // Создаем объект
    for (let i = 0; i < allData.length; i++) {
      for (let j = i + 1; j < allData.length; j++) {
        if (allData[i].exchange !== allData[j].exchange && 
            allData[i].symbol === allData[j].symbol) { // Проверка на одинаковую пару

          // Рассчитываем прибыль
          const absoluteProfit = allData[j].price * (1 - 0.001) - allData[i].price * (1 + 0.001); // 0.1% комиссия
          const relativeProfit = (absoluteProfit / (allData[i].price * (1 + 0.001))) * 100;

          if (relativeProfit > 0) { // Проверяем положительную прибыль
            result[`${allData[i].exchange}-${allData[j].exchange}-${allData[i].symbol}`] = {
              exchange1: allData[i].exchange,
              exchange2: allData[j].exchange,
              symbol: allData[i].symbol,
              price1: allData[i].price,
              price2: allData[j].price,
              absoluteProfit: absoluteProfit.toFixed(2), // Округление absoluteProfit
              relativeProfit: relativeProfit.toFixed(2), // Округление relativeProfit
              timestamp: Date.now(), // Добавляем метку времени
            };
          } 
        }
      }
    }

    // Получаем информацию о контрактах и сетях для всех связок
    for (const key in result) {
      const { exchange1, exchange2, symbol } = result[key];

      // Получаем информацию о контракте и сетях
      const contractData1 = await getContractData(exchange1, symbol);
      const contractData2 = await getContractData(exchange2, symbol);

      if (contractData1 && contractData2 && contractData1.contract && contractData2.contract && contractData1.contract === contractData2.contract) { // Проверяем одинаковый контракт
        result[key].networks = contractData1.networks; // Добавляем информацию о сетях
      } else {
        // console.log(`Пропущена пара ${symbol} из-за разного контракта.`);
        delete result[key]; // Удаляем связку из-за разного контракта
      }
    }

    //  Разбиваем данные на части
    const chunkSize = 50; // Количество пар в каждой части
    const chunks = Object.entries(result).reduce((acc, [key, value], index) => {
      const chunkIndex = Math.floor(index / chunkSize);
      if (!acc[chunkIndex]) {
        acc[chunkIndex] = {};
      }
      acc[chunkIndex][key] = value;
      return acc;
    }, []);

    // Отправляем данные частями
    for (const chunk of chunks) {
      console.log('Отправляем часть данных:', chunk);
      res.json(chunk);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка для имитации обработки
    }
    // console.log('Данные для API:', JSON.stringify(result, null, 2)); // Выводим в консоль данные для API (в формате JSON)

    // return result; // Возвращаем объект

  } catch (error) {
    console.error('Общая ошибка:', error);
  }
}

// Обработчик запроса /api/scanner
router.get('/', async (req, res) => {
  try {
    await main(); // Вызываем главную функцию
    // res.json(scannerData); // Отправляем данные в формате JSON
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;