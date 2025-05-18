const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Проверка переменных окружения
if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('❌ TELEGRAM_BOT_TOKEN не указан в .env');
}

// Инициализация бота
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
  pollingOptions: {
    timeout: 30, // Время ожидания обновлений (секунды)
    limit: 100,  // Максимум сообщений за один запрос
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

// Обработка ошибок
bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error.message);
});

bot.on('error', (error) => {
  console.error('❌ Общая ошибка бота:', error.message);
});

// Корректное завершение работы
process.on('SIGINT', () => {
  console.log('⚠️ Получен SIGINT — остановка бота');
  bot.stopPolling();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('⚠️ Получен SIGTERM — остановка бота');
  bot.stopPolling();
  process.exit(0);
});

console.log('✅ Бот запущен в режиме Polling');