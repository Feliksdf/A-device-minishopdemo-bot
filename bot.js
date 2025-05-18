const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
require('dotenv').config();

// Инициализация бота с защитой от дублирования
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
    webHook: true,
    key: null, // Опционально: путь к приватному ключу
    cert: null // Опционально: путь к сертификату
  });

  const webhookUrl = process.env.BOT_WEBHOOK_URL || `https://ваш-проект.onrender.com/telegram`;

  // Установка WebHook
  botInstance.setWebHook(webhookUrl).catch(err => {
    console.error('❌ Ошибка Webhook:', err.message);
  });

  // Обработчик команды /start
  botInstance.onText(/\/start/, (msg) => {
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

    botInstance.sendMessage(chatId,
      'Добро пожаловать в A-Device! 🛍️\n\n' +
      'Нажмите кнопку ниже, чтобы открыть наш веб-магазин:',
      options
    ).catch(err => {
      console.error('❌ Ошибка отправки сообщения:', err.message);
    });
};

// Инициализация сервера
const app = express();
const PORT = process.env.PORT; // Render предоставляет порт напрямую

// Обработка WebApp
app.use(express.static(__dirname + '/public'));
app.get('/shop', (req, res) => {
  res.sendFile(__dirname + '/public/shop.html');
});

// Обработка Webhook
app.use(express.json());
app.post('/telegram', (req, res) => {
  if (botInstance) {
    botInstance.processUpdate(req.body);
  }
  res.sendStatus(200);
});

// Обработчики сигналов остановки
process.on('SIGTERM', () => {
  console.log('⚠️ Получен SIGTERM — остановка бота');
  if (botInstance) botInstance.stopWebHook();
});

process.on('SIGINT', () => {
  console.log('⚠️ Получен SIGINT — остановка бота');
  if (botInstance) botInstance.stopWebHook();
  process.exit(0);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  initializeBot();
});