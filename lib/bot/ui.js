import bot from './bot';
import helper from './helpers/helper';
import UserCategoriesService from './../services/userCategories.service';
import {
  START_MESSAGE_CHOSE_CATEGORY,
  START_MESSAGE_CREATE_CATEGORY,
  START_MESSAGE_SHOW_LAST_SAVED_NOTES
} from './helpers/constants';

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

 bot.sendMessage(chatId, 'Что вы хотите сделать?', options);
}

export async function createNewCategory(chatId, userId) {
  const { messageId } = helper.getChatState(chatId);

  const text = 'Введите название новой категории';

  bot.deleteMessage(chatId, messageId);
  bot.sendMessage(chatId, text, null, false, callback);

  async function callback(categoryName) {
    const isCategoryAlreadyCreated = await UserCategoriesService.addNewCategory(userId, categoryName);

    await bot.deleteMessage(chatId, helper.getChatState(chatId).messageId);

    if (isCategoryAlreadyCreated) {
      bot.sendMessage(chatId, `Категория "${categoryName}" уже существует`);
    } else {
      bot.sendMessage(chatId, `Категория "${categoryName}" добавлена`);
    }

    helper.removeLastState(chatId);
  }
}

export async function showCategoriesList(chatId, userId) {
  const categories = await UserCategoriesService.getCategoriesList(userId);

  const inline_keyboard = categories.map(({ name, _id }) => ([{
    text: name || '1',
    callback_data: `SELECTED_CATEGORY__id:${_id}`
  }]));

  const options = {
    reply_markup: {
      inline_keyboard
    }
  };

  const { messageId } = helper.getChatState(chatId);
  bot.deleteMessage(chatId, messageId);

  bot.sendMessage(chatId, 'Категории:', options);
}

export async function reSendLastMessage(chatId) {
  const { text, options, isSavedState } = helper.getChatState(chatId).messageData;

  await bot.deleteMessage(chatId, helper.getChatState(chatId).messageId);
  await bot.sendMessage(chatId, text, options, isSavedState);
}

export async function back(chatId) {
  const { text, options, isSavedState } = helper.getPrevChatState(chatId).messageData;

  await bot.deleteMessage(chatId, helper.getChatState(chatId).messageId);
  await bot.sendMessage(chatId, text, options, isSavedState);
}

export function exit(chatId, messageId) {
  helper.resetState(chatId);
  bot.deleteMessage(chatId, messageId);
}
