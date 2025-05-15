const { Telegraf } = require('telegraf');

// === Замените на ваш токен из BotFather ===
const BOT_TOKEN = '8022144232:AAGCdMHr-0abUqhqjHGv5SBcSdiPzyWZz2I';

// === Замените на ваш Telegram ID ===
const ADMIN_CHAT_ID = '1438809874';

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN не задан в .env');
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.replyWithHTML(
    '👋 Добро пожаловать в <b>A-Device</b>!\n\n' +
    'Выберите товары в магазине и нажмите "Связаться", чтобы оформить заказ.',
    {
      reply_markup: {
        inline_keyboard: [
          [{
            text: '🛍️ Открыть магазин',
            web_app: { url: 'https://adeviceminishopdemo2.vercel.app' }
          }]
        ]
      }
    }
  );
});

bot.on('text', (ctx) => {
  const message = ctx.message.text;
  const from = ctx.message.from;

  if (message.startsWith('Здравствуйте!')) {
    const fullMessage = `📦 Новый заказ от ${from.first_name} (@${from.username || 'no_username'})\n\n${message}`;
    bot.telegram.sendMessage(ADMIN_CHAT_ID, fullMessage);
    ctx.reply('✅ Спасибо! Мы свяжемся с вами в ближайшее время.');
  }
});

bot.launch();

console.log('✅ Бот запущен');