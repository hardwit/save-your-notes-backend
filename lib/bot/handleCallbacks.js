const bot = require('./bot');
const ui = require('./ui');
const {
  START_MESSAGE_CHOSE_CATEGORY,
  START_MESSAGE_CREATE_CATEGORY,
  START_MESSAGE_SHOW_LAST_SAVED_NOTES,
  START_MESSAGE_CANCEL
} = require('./callbackData');

const onCallbackQuery = ({ data, message }) => {
  const opts = {
    chat_id: message.chat.id,
    message_id: message.message_id
  };

  let text;

  switch (data) {
    case START_MESSAGE_CREATE_CATEGORY: text = 'Выбрано первое действие';
    break;
    case START_MESSAGE_CHOSE_CATEGORY: text = 'Выбрано первое действие';
      break;
    case START_MESSAGE_SHOW_LAST_SAVED_NOTES: text = 'Выбрано первое действие';
      break;
    case START_MESSAGE_CANCEL: ui.removeLastMessage();
      break;
    default: text = 'ХЗ';
  }


  // bot.editMessageText(text, opts);
};

module.exports = onCallbackQuery;