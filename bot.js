const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
require('dotenv').config();

const app = express();
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { webHook: true });

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
    .catch(err => console.error('❌ Ошибка отправки:', err.message));
});

// WebHook endpoint
app.post('/telegram', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Установка WebHook
const webhookUrl = process.env.BOT_WEBHOOK_URL || 'https://your-project.onrender.com/telegram ';
bot.setWebHook(webhookUrl).catch(err => {
  console.error('❌ Ошибка Webhook:', err.message);
});

// Сервер
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});