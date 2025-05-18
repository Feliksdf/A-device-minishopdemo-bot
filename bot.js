// server.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Проверка окружения
const REQUIRED_ENV = ['TELEGRAM_BOT_TOKEN', 'WEB_APP_URL'];
const missingEnv = REQUIRED_ENV.filter(key => !process.env[key]);
if (missingEnv.length) {
  console.error('❌ Отсутствуют переменные:', missingEnv.join(', '));
  process.exit(1);
}

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Инициализация бота
const bot = new TelegramBot(token, {
  polling: {
    params: {
      timeout: 10 // Используется вместо устаревшего polling.timeout
    }
  },
  autoCancel: true // Ручное управление отменой промисов
});
// Обработчик deep-ссылки
bot.onText(/\/start app=(\w+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const appName = match[1]; // Например: "shop"

  if (appName === "shop") {
    await bot.sendMessage(chatId, "Открываю магазин...", {
      reply_markup: {
        inline_keyboard: [[{
          text: "🛍️ Перейти в магазин",
          web_app: { url: process.env.WEB_APP_URL }
        }]]
      }
    });
  }
});
const publishToChannel = async () => {
  try {
    // Укажите ID вашего канала (пример: "@a_device_channel" или "-1001234567890")
    const CHANNEL_ID = '@ADeviceopt'; 

    // Проверка прав бота
    const chat = await bot.getChat(CHANNEL_ID);
    console.log(`🔎 Канал найден: ${chat.title}`);

    // Отправка сообщения с кнопкой
    await bot.sendMessage(CHANNEL_ID, '🎉 Добро пожаловать в наш магазин!', {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🛍️ Открыть магазин',
              web_app: { 
                url: process.env.WEB_APP_URL 
              }
            }
          ]
        ]
      }
    });

    console.log('✅ Сообщение с кнопкой опубликовано!');
  } catch (error) {
    console.error('❌ Ошибка:', {
      message: error.message,
      stack: error.stack
    });
  }
};
// Конфигурация Express
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
// ... предыдущий код (инициализация бота и express)

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;
  
  const keyboard = {
    reply_markup: {
      inline_keyboard: [[{
        text: '🛍️ Открыть магазин',
        web_app: { url: process.env.WEB_APP_URL }
      }]]
    }
  };

  const welcomeMessage = `
👋 Привет, ${user.first_name || 'пользователь'}!
Добро пожаловать в A-Device - магазин качественной техники и аксессуаров

Нажмите кнопку ниже для выбора товаров:
  `.trim();

  bot.sendMessage(chatId, welcomeMessage, keyboard)
    .catch(error => console.error('Ошибка отправки:', error));
});
// server.js
require('dotenv').config();

// Проверка переменных окружения
if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.WEB_APP_URL) {
  console.error('❌ Проверьте .env файл! Требуются TELEGRAM_BOT_TOKEN и WEB_APP_URL');
  process.exit(1);
}
// Телеметрия для Glitch
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    webApp: process.env.WEB_APP_URL,
    node: process.version
  });
});

// Обработка ошибок
process.on('unhandledRejection', (reason) => {
  console.error('⚠️ Необработанное обещание:', reason);
});

bot.on('polling_error', (error) => {
  console.error('🔴 Ошибка поллинга:', error.message);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`
  🚀 A-Device Bot запущен
  ==========================
  Версия: 2.1.0
  Порт: ${PORT}
  WebApp: ${process.env.WEB_APP_URL}
  Node.js: ${process.version}
  ==========================
  `);
});