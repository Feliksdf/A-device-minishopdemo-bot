const TelegramBot = require('node-telegram-bot-api');
const express = require('express'); // Для HTTP-сервера
require('dotenv').config();

// Проверка токена
if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('❌ TELEGRAM_BOT_TOKEN не указан в .env');
}

// Инициализация бота
let bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: {
    interval: 1000,
    autoStart: true,
    params: {
      timeout: 10,
    },
  },
});

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const webAppUrl = process.env.WEB_APP_URL || 'https://adeviceminishopdemo.vercel.app ';

  const options = {
    reply_markup: {
      inline_keyboard: [[{
        text: '🛍️ Открыть магазин',
        web_app: { url: webAppUrl }
      }]]
    }
  };

  bot.sendMessage(chatId, 'Добро пожаловать в A-Device! 🛍️\n\n' +
    'Нажмите кнопку ниже, чтобы открыть наш веб-магазин:', options)
    .catch(err => console.error('❌ Ошибка отправки сообщения:', err.message));
});

// HTTP-сервер для поддержания активности
const app = express();
const PORT = process.env.PORT || 3000;

// Маршрут для проверки статуса сервера
app.get('/health', (req, res) => {
  res.status(200).send('OK'); // Ответ на запрос UptimeRobot
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 HTTP-сервер запущен на порту ${PORT}`);
});

// Обработчики ошибок
bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error.message);
  restartBot();
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  restartBot();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason.message);
  restartBot();
});

// Функция перезапуска бота
function restartBot() {
  console.log('🔄 Перезапуск бота через 5 секунд...');
  bot.stopPolling(); // Останавливаем текущий polling

  setTimeout(() => {
    bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: {
        interval: 1000,
        autoStart: true,
        params: {
          timeout: 10,
        },
      },
    });
    console.log('✅ Бот перезапущен');
  }, 5000);
}