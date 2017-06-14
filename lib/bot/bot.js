const TelegramBot = require('node-telegram-bot-api');
const config = require('./../config');
import { EXIT } from './callbackData';
import _ from 'lodash';

const token = config.get('bot_token');

const bot = new TelegramBot(token, { polling: true });

function traceMethodCalls(obj) {
  let handler = {
    get(target, propKey) {
      const origMethod = target[propKey].bind(obj);

      if (propKey === 'sendMessage') {
        return function(chatId, text, opt) {
          let options = _.cloneDeep(opt);

          if (options && options.reply_markup) {
            options.reply_markup.inline_keyboard.push([{ text: 'Закрыть', callback_data: EXIT }]);
          }

          if (!options) {
            options = {
              reply_markup: {
                inline_keyboard: [
                  [{ text: 'Закрыть', callback_data: EXIT }]
                ]
              }
            };
          }

          if (!options.reply_markup) {
            options.reply_markup = {
              inline_keyboard: [
                [{ text: 'Закрыть', callback_data: EXIT }]
              ]
            }
          }

          if (!options.reply_markup.inline_keyboard) {
            options.reply_markup.inline_keyboard = [
              [{ text: 'Закрыть', callback_data: EXIT }]
            ];
          }

          return origMethod(chatId, text, options);
        }
      }

      return origMethod
    }
  };

  return new Proxy(obj, handler);
}

export default traceMethodCalls(bot);
