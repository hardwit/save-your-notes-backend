const bot = require('./bot');

const onCallbackQuery = ({ data, message }) => {
  const opts = {
    chat_id: message.chat.id,
    message_id: message.message_id
  };

  let text;

  switch (data) {
    case '': text = 'Выбрано первое действие';
    break;
    default: text = 'ХЗ';
  }


  bot.editMessageText(text, opts);
};

module.exports = onCallbackQuery;