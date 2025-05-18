const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
require('dotenv').config();

// Подключение к серверу
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 10000;

// Инициализация бота
let botInstance = null;

const initializeBot = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('❌ TELEGRAM_BOT_TOKEN не указан в .env');
  }

  if (botInstance) {
    console.warn('⚠️ Бот уже запущен');
    return botInstance;
  }

  botInstance = new TelegramBot(token, {
    polling: {
      params: {
        timeout: 10,
        interval: 2000
      }
    },
    autoCancel: true
  });

  // Обработчики команд
  botInstance.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const options = {
      reply_markup: {
        inline_keyboard: [[{
          text: '🛍️ Открыть магазин',
          web_app: { url: process.env.WEB_APP_URL || 'https://adeviceminishopdemo.vercel.app ' }
        }]]
      }
    };
    
    botInstance.sendMessage(chatId, 
      'Добро пожаловать в A-Device! 🛍️\n\n' + 
      'Нажмите кнопку ниже, чтобы открыть наш веб-магазин:', 
      options
    ).catch(err => {
      console.error('❌ Ошибка отправки сообщения:', err);
    });
  });

  // Обработка ошибок
  botInstance.on('polling_error', (error) => {
    console.error('❌ Polling error:', error.message);
  });

  botInstance.on('webhook_error', (error) => {
    console.error('❌ Webhook error:', error.message);
  });

  return botInstance;
};

// Установка Webhook
app.post('/telegram', (req, res) => {
  botInstance.processUpdate(req.body);
  res.sendStatus(200);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  initializeBot();
});