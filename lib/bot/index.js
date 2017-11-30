import bot from './bot'
import handleMessage from './receiveMessages'
import onCallbackQuery from './handleCallbacks'

bot.on('message', handleMessage)
bot.on('callback_query', onCallbackQuery)
