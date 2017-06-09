const bot = require('./bot');
const handleMessage = require('./receiveMessages');

bot.on('message', handleMessage);