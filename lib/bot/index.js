const bot = require('./bot');
const handleMessage = require('./receiveMessages');
const onCallbackQuery = require('./handleCallbacks');

bot.on('message', handleMessage);
bot.on('callback_query', onCallbackQuery);