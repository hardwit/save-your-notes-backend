import _ from 'lodash';
import { EXIT, BACK } from './callbackData';
import helper from './helper';

export function sendMessageProxy(originalMethod) {
  return function (chatId, text, opt) {
    let options = _.cloneDeep(opt);
    let newOptions = [[{ text: 'Закрыть', callback_data: EXIT }]];

    if (helper.getPrevChatState(chatId)) {
      newOptions.unshift([{ text: 'Назад', callback_data: BACK }])
    }

    if (options && options.reply_markup) {
      options.reply_markup.inline_keyboard.push(...newOptions);
    }

    if (!options) {
      options = {
        reply_markup: {
          inline_keyboard: [
            ...newOptions
          ]
        }
      };
    }

    if (!options.reply_markup) {
      options.reply_markup = {
        inline_keyboard: [
          ...newOptions
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