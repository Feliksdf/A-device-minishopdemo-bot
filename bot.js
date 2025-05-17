// Отключаем устаревшее предупреждение о NTBA_FIX_319
process.env.NTBA_FIX_319 = 'true';

const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Токен от BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token);

// URL для WebHook (замените на ваш проект Glitch)
const webhookUrl = `https://ваш-проект.glitch.me/${token}`;

// Установка WebHook
bot.setWebHook(webhookUrl).then(() => {
  console.log(`✅ WebHook установлен: ${webhookUrl}`);
});

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = `
🚀 Добро пожаловать в A-Device!

🛒 Здесь вы можете купить оригинальную технику Apple и аксессуары.

👉 Нажмите кнопку ниже, чтобы открыть магазин:
  `;

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📱 Открыть магазин', web_app: { url: 'https://a-device.vercel.app ' } }]
      ]
    }
  };

  bot.sendMessage(chatId, message, keyboard);
});

// Express сервер
const express = require('express');
const app = express();
app.use(express.json());

// Роут для Telegram WebHook
app.post(`/${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Бот запущен на порту ${PORT}`);
});