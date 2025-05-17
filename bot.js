const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
require('dotenv').config();

// Инициализация бота
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('Ошибка: Необходимо указать TELEGRAM_BOT_TOKEN в .env файле');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
const app = express();
const PORT = process.env.PORT || 3000;

// HTML страница магазина
const shopPage = `
<!DOCTYPE html>
<html>
<head>
    <title>My Web Shop</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 600px;
            margin: auto;
            background-color: #f5f5f5;
        }
        .header {
            text-align: center;
            padding: 20px 0;
        }
        .product {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .product h2 {
            margin-top: 0;
            color: #2563eb;
        }
        .price {
            color: #2563eb;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Добро пожаловать в наш магазин!</h1>
        <p>Выберите товары из нашего ассортимента</p>
    </div>

    <div class="product">
        <h2>iPhone 15 Pro</h2>
        <p class="price">$1199</p>
        <p>Самая мощная камера Apple с передовыми технологиями и процессором A16 Bionic</p>
    </div>

    <div class="product">
        <h2>Samsung Galaxy S23 Ultra</h2>
        <p class="price">$1399</p>
        <p>Флагманский смартфон с камерой 200 МП и улучшенным процессором Snapdragon 8 Gen 2</p>
    </div>

    <div class="product">
        <h2>Apple Watch Ultra 2</h2>
        <p class="price">$799</p>
        <p>Спортивные часы с расширенными функциями здоровья и активности</p>
    </div>

    <div class="product">
        <h2>MacBook Air M2</h2>
        <p class="price">$1299</p>
        <p>Ультратонкий ноутбук с чипом M2 и длительным временем автономной работы</p>
    </div>

    <script>
        // Поддержка Telegram WebApp
        if (window.TelegramWebviewProxy) {
            TelegramWebviewProxy.sendEvent("page_loaded");
        }
    </script>
</body>
</html>
`;

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    const options = {
        reply_markup: {
            inline_keyboard: [[{
                text: '🛍️ Открыть магазин',
                web_app: { 
                    url: process.env.WEB_APP_URL || 'https://your-project.glitch.me/shop ' 
                }
            }]]
        }
    };
    
    bot.sendMessage(chatId, 'Добро пожаловать в наш м