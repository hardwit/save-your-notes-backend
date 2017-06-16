const log = require('../../log')(module);
import _ from 'lodash';
import { EXIT, BACK, WAITING_FOR_CHOICE_STATUS, WAITING_FOR_INPUT_STATUS } from './constants';
import helper from './helper';

export function sendMessageProxy(originalMethod) {
  return async function (chatId, text, opt, isSavedState, callback) {
    try {
      let options = _.cloneDeep(opt);

      if (isSavedState) {
        const message = await originalMethod(chatId, text, _.cloneDeep(options));

        const messageData = {
          chatId,
          text,
          options
        };

        helper.addState(chatId, message.message_id, messageData, helper.getChatState(chatId));

        return message;
      }

      let newOptions = [[{ text: 'Закрыть', callback_data: EXIT }]];
      let status;

      if (helper.getChatState(chatId) && helper.getChatState(chatId).status !== WAITING_FOR_INPUT_STATUS) {
        newOptions.unshift([{ text: 'Назад', callback_data: BACK }])
      }

      if (options && options.reply_markup && options.reply_markup.inline_keyboard) {
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

        status = WAITING_FOR_INPUT_STATUS;
      }

      if (!options.reply_markup) {
        options.reply_markup = {
          inline_keyboard: [
            ...newOptions
          ]
        };

        status = WAITING_FOR_CHOICE_STATUS;

      }

      if (!options.reply_markup.inline_keyboard) {
        options.reply_markup.inline_keyboard = [
          [{ text: 'Закрыть', callback_data: EXIT }]
        ];

        status = WAITING_FOR_CHOICE_STATUS;
      }

      const message = await originalMethod(chatId, text, _.cloneDeep(options));

      const messageData = {
        chatId,
        text,
        options
      };

      helper.addState(chatId, message.message_id, messageData, status, callback);

      return message;
    }
    catch (error) {
      log.error(error);
    }
  }
}

export function deleteMessageProxy(originalMethod) {
  return async function (chatId, messageId) {
    return originalMethod(chatId, messageId);
  }
}