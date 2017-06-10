import bot from './bot';
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

  bot.isWaitingForChoice = true;
  bot.lastMessageInfo = {
    message_id: message.message_id,
    chat_id: message.chat.id,
    uiMethod: sendStartMessage
  };
}

export function reSendLastMessage() {
  const { chat_id, message_id, uiMethod } = bot.lastMessageInfo;

  bot.deleteMessage(chat_id, message_id);
  uiMethod(chat_id);

  bot.isWaitingForChoice = false;
}

export function removeLastMessage() {
  const { chat_id, message_id } = bot.lastMessageInfo;

  bot.deleteMessage(chat_id, message_id);

  bot.isWaitingForChoice = false;
}
