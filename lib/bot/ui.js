import bot from './bot';
import helper from './helper';
import UserCategoriesService from './../services/userCategories.service';
import {
  START_MESSAGE_CHOSE_CATEGORY,
  START_MESSAGE_CREATE_CATEGORY,
  START_MESSAGE_SHOW_LAST_SAVED_NOTES
} from './callbackData';

export async function sendStartMessage(chatId) {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Выбрать категорию из существующих', callback_data: START_MESSAGE_CHOSE_CATEGORY }],
        [{ text: 'Добавить новую категорию', callback_data: START_MESSAGE_CREATE_CATEGORY }],
        [{ text: 'Посмотреть последние 20 сохраненных записей', callback_data: START_MESSAGE_SHOW_LAST_SAVED_NOTES }]
      ]
    }
  };

  const message = await bot.sendMessage(chatId, 'Что вы хотите сделать?', options);

  helper.setWaitingState(chatId, message.message_id, 'waitingForChoice', sendStartMessage.bind(null, chatId));
}

export async function createNewCategory(chatId, userId) {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Назад', callback_data: START_MESSAGE_CHOSE_CATEGORY }],
      ]
    }
  };

  const { messageId } = helper.getChatState(chatId);

  const text = 'Введите название новой категории';

  bot.editMessageText(text, { chat_id: chatId, message_id: messageId });

  const callback = async function(categoryName) {
    const isCategoryAlreadyCreated = await UserCategoriesService.addNewCategory(userId, categoryName);

    bot.deleteMessage(chatId, messageId);

    if (isCategoryAlreadyCreated) {
      bot.sendMessage(chatId, `Категория "${categoryName}" уже существует`, options);
    } else {
      bot.sendMessage(chatId, `Категория "${categoryName}" добавлена`, options);
    }

    helper.removeLastState(chatId);
  };

  helper.setWaitingState(chatId, messageId, 'waitingForInput', callback);
}

export async function showCategoriesList(chatId, userId) {
  const categories = await UserCategoriesService.getCategoriesList(userId);

  const inline_keyboard = categories.map(({ name, _id }) => ([{ text: name, callback_data: `SELECTED_CATEGORY__id:${_id}` }]));

  const options = {
    reply_markup: {
      inline_keyboard
    }
  };


  const { messageId } = helper.getChatState(chatId);
  exit(chatId, messageId);

  const message = await bot.sendMessage(chatId, 'Категории:', options);

  // helper.setWaitingState(chatId, message.message_id, 'waitingForChoice', sendStartMessage.bind(null, chatId));
}

export function reSendLastMessage(chatId) {
  const { messageId, callback } = helper.getChatState(chatId);

  bot.deleteMessage(chatId, messageId);
  helper.removeLastState(chatId);
  callback();
}

export function exit(chatId, messageId) {
  helper.resetState(chatId);
  bot.deleteMessage(chatId, messageId);
}
