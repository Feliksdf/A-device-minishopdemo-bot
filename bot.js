const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Токен из BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log("✅ Telegram-бот запущен...");

// Команда /start
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