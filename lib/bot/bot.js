const TelegramBot = require('node-telegram-bot-api')
import config from './../config'
import { sendMessageProxy, deleteMessageProxy } from './helpers/proxies'

const token = config.get('bot_token')
const bot = new TelegramBot(token, { polling: true })

function getProxiedBotObject(bot) {
  let handler = {
    get(target, propKey) {
      const originalMethod = target[propKey].bind(bot)

      switch (propKey) {
        case 'sendMessage':
          return sendMessageProxy(originalMethod)
        case 'deleteMessage':
          return deleteMessageProxy(originalMethod)
        default:
          return originalMethod
      }
    }
  }

  return new Proxy(bot, handler)
}

export default getProxiedBotObject(bot)
