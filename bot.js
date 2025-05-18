const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
require('dotenv').config(); // ✅ Загрузка .env ДО инициализации бота

// ✅ Проверка наличия токена
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error('❌ TELEGRAM_BOT_TOKEN не указан в .env');
}

// ✅ Используйте autoCancel: true для совместимости
const bot = new TelegramBot(token, {
  polling: {
    params: {
      timeout: 10,
      interval: 2000
    }
  },
  autoCancel: true
});

const app = express();
const PORT = process.env.PORT || 10000;

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  const options = {
    reply_markup: {
      inline_keyboard: [[{
        text: '🛍️ Открыть магазин',
        web_app: { 
          url: process.env.WEB_APP_URL || 'https://adeviceminishopdemo.vercel.app '
        }
      }]]
    }
  };
  
  bot.sendMessage(chatId, 
    'Добро пожаловать в A-Device! 🛍️\n\n' + 
    'Нажмите кнопку ниже, чтобы открыть наш веб-магазин:', 
    options
  ).catch(err => {
    console.error('Ошибка отправки сообщения:', err);
  });
});

// Обработка ошибок бота
bot.on('polling_error', (error) => {
  console.error('Telegram polling error:', error);
});

// Роуты для WebApp
app.get('/', (req, res) => {
  res.send('Telegram WebApp для магазина');
});

app.get('/shop', (req, res) => {
  res.sendFile(__dirname + '/public/shop.html');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});