const log = require('../log')(module);
import bot from './bot';
import helper from './helpers/helper';
import UserCategoriesService from './../services/userCategories.service';
import {
  START_MESSAGE_CHOSE_CATEGORY,
  START_MESSAGE_CREATE_CATEGORY,
  START_MESSAGE_SHOW_LAST_SAVED_NOTES,
  SELECT_CATEGORY_FOR_NOTE_ADDING,
  SELECT_CATEGORY_FOR_NOTES_GETTING,
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
      callback_data: `${SELECT_CATEGORY_FOR_NOTES_GETTING}&&${name}`
    }]));

    const options = {
      reply_markup: {
        inline_keyboard
      }
    };

    if (helper.getChatState(chatId)) {
      const { messageId } = helper.getChatState(chatId);
      await bot.deleteMessage(chatId, messageId);
    }

    bot.sendMessage({ chatId, text: 'Категории:', options });
  }
  catch (error) {
    log.error(error);
  }
}

export async function showCategoriesForNewNote(chatId, userId, note) {
  try {
    helper.saveNewNote(chatId, note);

    const categories = await UserCategoriesService.getCategoriesList(userId);

    const inline_keyboard = categories.map(({ name }) => ([{
      text: name,
      callback_data: `${SELECT_CATEGORY_FOR_NOTE_ADDING}&&${name}`
    }]));

    const options = {
      reply_markup: {
        inline_keyboard
      }
    };

    bot.sendMessage({ chatId, text: 'Категории:', options });
  }
  catch (error) {
    log.error(error);
  }
}

export async function addNewNote(chatId, userId, categoryName, note) {
  try {
    await UserCategoriesService.addNewNote(userId, categoryName, note);

    if (helper.getChatState(chatId)) {
      const { messageId } = helper.getChatState(chatId);
      await bot.deleteMessage(chatId, messageId);
    }

    await bot.sendMessage({ chatId, text: 'Заметка добавлена' });
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
