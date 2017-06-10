const TelegramBot = require('node-telegram-bot-api');
const config = require('./../config');

const token = config.get('bot_token');

const bot = new TelegramBot(token, {polling: true});

export default bot;
