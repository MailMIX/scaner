// Импорты
const ccxtPro = require('ccxt').pro;
const Exchange = require('../models/Exchange'); // Модель данных для бирж
const ProfitablePair = require('../models/ProfitablePair'); // Модель данных для прибыльных пар

// Константы
const COMMISSION_RATE = 0.001; // Комиссия 0.1%
const POLLING_INTERVAL = 10 * 60 * 1000; // 10 минут
let exchangeConnections = {}; // Для хранения соединений с биржами
let cachedMarkets = {}; // Кэширование рынков

// Функция для загрузки рынков
const loadMarkets = async (reload = false) => {
    if (!reload && Object.keys(cachedMarkets).length > 0) {
        console.log('Используем кэшированные рынки.');
        return cachedMarkets;
    }

    console.log('Начало загрузки рынков');
    const exchangeKeys = await Exchange.find(); // Получаем ключи бирж
    exchangeConnections = {};
    const allMarkets = {};

    for (const exchangeKey of exchangeKeys) {
        const exchangeName = exchangeKey.name;
        exchangeConnections[exchangeName] = new ccxtPro[exchangeName]({
            apiKey: exchangeKey.apiKey,
            secret: exchangeKey.apiSecret,
        });
        console.log(`Соединение с биржей ${exchangeName} установлено.`);

        // Загрузим рынки для каждой биржи
        const markets = await exchangeConnections[exchangeName].loadMarkets();
        console.log(`Загружены рынки для ${exchangeName}. Общее количество рынков: ${Object.keys(markets).length}`);

        const filteredMarkets = Object.values(markets)
            .filter(market => market.symbol.split(':').length === 1 && market.type === 'spot');

        allMarkets[exchangeName] = filteredMarkets.map(market => market.symbol); // Сохраняем только отфильтрованные символы
        console.log(`Загружено ${filteredMarkets.length} спотовых пар для ${exchangeName}.`);
    }

    console.log('Загрузка рынков завершена.');
    cachedMarkets = allMarkets; // Кэшируем загруженные рынки
    console.log('Все загруженные рынки:', JSON.stringify(cachedMarkets, null, 2)); // Логируем все рынки
    return cachedMarkets; // Возвращаем все загруженные рынки
};

// Функция для получения всех тикеров
const fetchAllTickers = async () => {
    console.log('Начало получения всех тикеров');
    const allTickers = {};

    const allMarkets = cachedMarkets; // Используем кэшированные рынки
    console.log('Используем загруженные рынки:', JSON.stringify(allMarkets, null, 2));

    const exchangeKeys = await Exchange.find();

    for (const exchangeKey of exchangeKeys) {
        const exchangeName = exchangeKey.name;
        const exchangeObject = exchangeConnections[exchangeName];

        try {
            const marketsToFetch = allMarkets[exchangeName];
            console.log(`Запрашиваем тикеры для биржи ${exchangeName}:`, marketsToFetch);

            const tickers = await exchangeObject.fetchTickers(marketsToFetch);

            allTickers[exchangeName] = tickers;
            console.log(`Тикеры получены для биржи ${exchangeName}. Количество тикеров: ${Object.keys(tickers).length}`);
        } catch (error) {
            console.error(`Ошибка получения тикеров из ${exchangeName}: ${error.message}`);
        }
    }

    console.log('Получение всех тикеров завершено.');
    return allTickers;
};

// Функция для расчета прибыли
const calculateProfit = (allMarkets, allTickers) => {
    console.log('Начало расчета прибыли');

    const profitPairs = {}; // Для хранения уникальных прибыльных пар по символу

    // Итерируемся по всем рынкам
    for (const buyExchange in allMarkets) {
        const buySymbols = allMarkets[buyExchange];

        for (const targetSymbol of buySymbols) {
            if (!allTickers[buyExchange] || !allTickers[buyExchange][targetSymbol]) {

            console.warn(`Тикеры не найдены для биржи ${buyExchange} или символ ${targetSymbol} отсутствует.`);
                continue; // Пропускаем итерацию, если тикеры не найдены
            }

            const buyPrice = allTickers[buyExchange][targetSymbol]?.bid;
            const sellPrice = allTickers[buyExchange][targetSymbol]?.ask;

            if (buyPrice == null || sellPrice == null) {
                console.warn(`Цены не определены для ${targetSymbol} на бирже ${buyExchange}`);
                continue; 
            }

            // Теперь ищем возможность продать на другой бирже
            for (const sellExchange in allMarkets) {
                if (sellExchange === buyExchange) {
                    continue; // Пропускаем ту же биржу
                }

                if (!allTickers[sellExchange] || !allTickers[sellExchange][targetSymbol]) {
                    console.warn(`Тикеры не найдены для биржи ${sellExchange} или символ ${targetSymbol} отсутствует.`);
                    continue; // Пропускаем итерацию, если тикеры не найдены
                }

                const sellPrice = allTickers[sellExchange][targetSymbol]?.ask;

                if (sellPrice == null) {
                    console.warn(`Цена продажи не определена для ${targetSymbol} на бирже ${sellExchange}`);
                    continue; 
                }

                const profitBeforeCommission = sellPrice - buyPrice;
                const buyCommission = buyPrice * COMMISSION_RATE;
                const sellCommission = sellPrice * COMMISSION_RATE;
                const profit = profitBeforeCommission - (buyCommission + sellCommission);
                const profitPercent = (profit / buyPrice) * 100;

                // Ограничение на прибыль не более 20%
                if (profitPercent > 0 && profitPercent <= 10) {
                    const key = targetSymbol;

                    // Получаем информацию о сетях
                    const buyCurrencyInfo = exchangeConnections[buyExchange].currencies[targetSymbol.split('/')[0]];
                    const sellCurrencyInfo = exchangeConnections[sellExchange].currencies[targetSymbol.split('/')[0]];

                    const buyNetworks = buyCurrencyInfo && buyCurrencyInfo.networks ?
                        Object.values(buyCurrencyInfo.networks) : [];

                    const sellNetworks = sellCurrencyInfo && sellCurrencyInfo.networks ?
                        Object.values(sellCurrencyInfo.networks) : [];

                    // Проверяем и обновляем только, если прибыль новая выше
                    if (!profitPairs[key] || profitPercent > profitPairs[key].profitPercent) {
                        profitPairs[key] = {
                            symbol: targetSymbol,
                            profitPercent,
                            exchangeBuy: buyExchange,
                            exchangeSell: sellExchange,
                            buyPrice,
                            sellPrice,
                            buyCommission,
                            sellCommission,
                            networks: {
                                buyNetworks,
                                sellNetworks,
                            }
                        };
                    }
                }
            }
        }
    }

    // Преобразовываем profitPairs в массив и сортируем по проценту прибыли
    const topProfitPairs = Object.values(profitPairs)
        .sort((a, b) => b.profitPercent - a.profitPercent) // Сортировка по убыванию прибыли
        .slice(0, 100); // Ограничиваем до 100

    console.log(`Расчет прибыли завершен. Найдено ${topProfitPairs.length} прибыльных пар.`);
    return topProfitPairs; // Возвращаем только 100 самых прибыльных пар
};

// Функция для сбора и отправки данных на фронтенд
const collectAndSendData = async (req, res) => {
    try {
        console.log('Начало сбора данных');
        
        // Первая загрузка рынков
        await loadMarkets();
        const allTickers = await fetchAllTickers();
        const profitPairs = calculateProfit(cachedMarkets, allTickers);

        console.log(`Расчет прибыли завершен. Найдено ${profitPairs.length} прибыльных пар.`);
        res.json(profitPairs); // Отправляем прибыльные пары клиенту
    } catch (error) {
        console.error(`Ошибка при сборе и отправке данных: ${error.message}`);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' }); // Отправляем ответ на ошибку клиенту
    }
};

// Экспорты
module.exports = {
    loadMarkets,
    fetchAllTickers,
    calculateProfit,
    collectAndSendData,
};

// Запуск сканирования на старте
const startPeriodicalUpdates = async () => {
    await loadMarkets(); // Загрузка рынков при старте
    setInterval(async () => {
        console.log('Запуск периодического обновления данных');
        await loadMarkets(true); // Обновление рынков раз в 10 минут
        await fetchAllTickers(); // Получение тикеров
    }, POLLING_INTERVAL);
};

startPeriodicalUpdates(); // Запускаем периодическое обновление