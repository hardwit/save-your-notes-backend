import bot from './bot';
import helper from './helper';
import UserCategoriesService from './../services/userCategories.service';
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

  helper.setWaitingState(chatId, message.message_id, 'waitingForChoice', sendStartMessage.bind(null, chatId));
}

export async function createNewCategory(chatId, userId) {
  const { messageId } = helper.getChatState(chatId);

  const text = 'Введите название новой категории';

  bot.editMessageText(text, { chat_id: chatId, message_id: messageId });

  const callback = async function(categoryName) {
    const isCategoryAlreadyCreated = await UserCategoriesService.addNewCategory(userId, categoryName);

    bot.deleteMessage(chatId, messageId);

    if (isCategoryAlreadyCreated) {
      bot.sendMessage(chatId, `Категория ${categoryName} уже существует`);
    } else {
      bot.sendMessage(chatId, `Категория ${categoryName} добавлена`);
    }

    helper.resetWaitingState(chatId);
  };

  helper.setWaitingState(chatId, messageId, 'waitingForInput', callback);
}

export function reSendLastMessage(chatId) {
  const { messageId, callback } = helper.getChatState(chatId);

  bot.deleteMessage(chatId, messageId);
  callback();
  helper.resetWaitingState(chatId);
}

export function removeLastMessage(chatId) {
  const { messageId } = helper.getChatState(chatId);
  helper.resetWaitingState(chatId);

  bot.deleteMessage(chatId, messageId);
}
