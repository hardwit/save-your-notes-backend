const log = require('../log')(module);
import bot from './bot';
import helper from './helpers/helper';
import UserCategoriesService from './../services/userCategories.service';
import {
  START_MESSAGE_CHOSE_CATEGORY,
  START_MESSAGE_CREATE_CATEGORY,
  START_MESSAGE_SHOW_LAST_SAVED_NOTES
} from './helpers/constants';

export async function sendStartMessage(chatId) {
  try {
    const options = {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Выбрать категорию из существующих', callback_data: START_MESSAGE_CHOSE_CATEGORY }],
          [{ text: 'Добавить новую категорию', callback_data: START_MESSAGE_CREATE_CATEGORY }],
          [{ text: 'Посмотреть последние 20 сохраненных записей', callback_data: START_MESSAGE_SHOW_LAST_SAVED_NOTES }]
        ]
      }
    };

    await bot.sendMessage({ chatId, text: 'Что вы хотите сделать?', options });
  }
  catch (error) {
    log.error(error);
  }
}

export async function createNewCategory(chatId, userId) {
  try {
    const { messageId } = helper.getChatState(chatId);

    const text = 'Введите название новой категории';

    await bot.deleteMessage(chatId, messageId);
    await bot.sendMessage({ chatId, text, callback});
  }
  catch (error) {
    log.error(error);
  }

  async function callback(categoryName) {
    try {
      const isCategoryAlreadyCreated = await UserCategoriesService.addNewCategory(userId, categoryName);

      await bot.deleteMessage(chatId, helper.getChatState(chatId).messageId);

      if (isCategoryAlreadyCreated) {
        bot.sendMessage({ chatId, text: `Категория "${categoryName}" уже существует` });
      } else {
        bot.sendMessage({ chatId, text: `Категория "${categoryName}" добавлена` });
      }

      helper.removeLastState(chatId);
    }
    catch (error) {
      log.error(error);
    }
  }
}

export async function showCategoryNotes(chatId, userId, categoryName) {
  await bot.deleteMessage(chatId, helper.getChatState(chatId).messageId);

  const notes = await UserCategoriesService.getNotes(userId, categoryName);

  if (notes.length) {
    notes.forEach(async note => await bot.sendMessage({ chatId, text: note }));
  } else {
    await bot.sendMessage({ chatId, text: 'Записей не найдено' });
  }
}

export async function showCategoriesList(chatId, userId) {
  try {
    const categories = await UserCategoriesService.getCategoriesList(userId);

    const inline_keyboard = categories.map(({ name }) => ([{
      text: name,
      callback_data: `SELECTED_CATEGORY_NAME:${name}`
    }]));

    const options = {
      reply_markup: {
        inline_keyboard
      }
    };

    const { messageId } = helper.getChatState(chatId);
    await bot.deleteMessage(chatId, messageId);

    bot.sendMessage({ chatId, text: 'Категории:', options });
  }
  catch (error) {
    log.error(error);
  }
}

export async function reSendLastMessage(chatId) {
  try {
    const { text, options, isSavedState } = helper.getChatState(chatId).messageData;

    await bot.deleteMessage(chatId, helper.getChatState(chatId).messageId);
    await bot.sendMessage({ chatId, text, options, isSavedState });
  }
  catch (error) {
    log.error(error);
  }
}

export async function back(chatId) {
  try {
    const { text, options, isSavedState } = helper.getPrevChatState(chatId).messageData;

    await bot.deleteMessage(chatId, helper.getChatState(chatId).messageId);
    await bot.sendMessage({ chatId, text, options, isSavedState });
  }
  catch (error) {
    log.error(error);
  }
}

export async function exit(chatId, messageId) {
  try {
    helper.resetState(chatId);
    await bot.deleteMessage(chatId, messageId);
  }
  catch (error) {
    log.error(error);
  }
}
