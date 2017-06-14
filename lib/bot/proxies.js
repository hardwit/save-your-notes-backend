import _ from 'lodash';
import { EXIT } from './callbackData';

export function sendMessageProxy(originalMethod) {
  return function (chatId, text, opt) {
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

    return originalMethod(chatId, text, options);
  }
}