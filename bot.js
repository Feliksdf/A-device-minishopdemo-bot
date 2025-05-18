// bot.js
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Инициализация бота с WebHook
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { webHook: true });
const webhookUrl = process.env.BOT_WEBHOOK_URL || `https://ваш-проект.onrender.com/telegram`;

// Установка WebHook
bot.setWebHook(webhookUrl).catch(err => {
  console.error('❌ Ошибка WebHook:', err.message);
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

// Обработка WebHook
app.use(express.json());
app.post('/telegram', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Обработчики сигналов остановки
process.on('SIGTERM', () => {
  console.log('⚠️ Получен SIGTERM — остановка бота');
  bot.stopWebHook();
});

process.on('SIGINT', () => {
  console.log('⚠️ Получен SIGINT — остановка бота');
  bot.stopWebHook();
  process.exit(0);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});