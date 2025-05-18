const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
require('dotenv').config();

const app = express();
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { webHook: true });

const webhookUrl = process.env.BOT_WEBHOOK_URL || 'https://ваш-проект.onrender.com/telegram';

// Установка Webhook
bot.setWebHook(webhookUrl).catch(err => {
  console.error('❌ Ошибка Webhook:', err.message);
});

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
    console.error('❌ Ошибка отправки сообщения:', err.message);
  });
});

// Роут для Telegram WebApp
app.get('/', (req, res) => {
  res.send('Telegram WebApp для магазина');
});

// Обработка WebApp
app.get('/shop', (req, res) => {
  res.sendFile(__dirname + '/public/shop.html');
});

// Обработка Webhook
app.post('/telegram', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Запуск сервера
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});