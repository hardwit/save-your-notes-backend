import bot from './bot';
import helper from './helper';
import {
  START_MESSAGE_CHOSE_CATEGORY,
  START_MESSAGE_CREATE_CATEGORY,
  START_MESSAGE_SHOW_LAST_SAVED_NOTES,
  START_MESSAGE_CANCEL
} from './callbackData';

export async function sendStartMessage(chatId) {
  const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Выбрать категорию из существующих', callback_data: START_MESSAGE_CHOSE_CATEGORY }],
        [{ text: 'Добавить новую категорию', callback_data: START_MESSAGE_CREATE_CATEGORY }],
        [{ text: 'Посмотреть последние 20 сохраненных записей', callback_data: START_MESSAGE_SHOW_LAST_SAVED_NOTES }],
        [{ text: 'Отмена', callback_data: START_MESSAGE_CANCEL }]
      ]
    })
  };

  const message = await bot.sendMessage(chatId, 'Что вы хотите сделать?', options);

  helper.setWaitingState(chatId, message.message_id, sendStartMessage);
}

export function reSendLastMessage(chatId) {
  const { messageId, uiMethod } = helper.getChatState(chatId);

  bot.deleteMessage(chatId, messageId);
  uiMethod(chatId);
  helper.resetWaitingState(chatId);
}

export function removeLastMessage(chatId) {
  const { messageId } = helper.getChatState(chatId);
  helper.resetWaitingState(chatId);

  bot.deleteMessage(chatId, messageId);
}
