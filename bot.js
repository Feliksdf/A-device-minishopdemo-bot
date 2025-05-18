const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
require('dotenv').config();

let botInstance = null;
let isBotActive = false;

const initializeBot = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('❌ TELEGRAM_BOT_TOKEN не указан в .env');
  }

  if (isBotActive) {
    console.warn('⚠️ Бот уже запущен');
    return botInstance;
  }

  botInstance = new TelegramBot(token, { webHook: true });
  isBotActive = true;

  const webhookUrl = process.env.BOT_WEBHOOK_URL || `https://a-device-minishopdemo-bot.onrender.com `;

  botInstance.setWebHook(webhookUrl).catch(err => {
    console.error('❌ Ошибка Webhook:', err.message);
  });

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
  });

  botInstance.on('webhook_error', (error) => {
    console.error('❌ Webhook error:', error.message);
  });

  return botInstance;
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'shop.html'), (err) => {
    if (err) {
      console.error('❌ Файл shop.html не найден:', err);
      res.status(500).send('Внутренняя ошибка сервера');
    }
  });
});

app.use(express.json());
app.post('/telegram', (req, res) => {
  if (botInstance) {
    botInstance.processUpdate(req.body);
  }
  res.sendStatus(200);
});

process.on('SIGTERM', () => {
  console.log('⚠️ Получен SIGTERM — остановка бота');
  if (botInstance) botInstance.stopWebHook();
  isBotActive = false;
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('⚠️ Получен SIGINT — остановка бота');
  if (botInstance) botInstance.stopWebHook();
  isBotActive = false;
  process.exit(0);
});

initializeBot();

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});