const bot = require('./bot');

async function sendStartMessage(chatId) {
  const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Выбрать категорию из существующих', callback_data: 'startMessage.chooseCategory' }],
        [{ text: 'Добавить новую категорию', callback_data: 'startMessage.createCategory' }],
        [{ text: 'Посмотреть последние 20 сохраненных записей', callback_data: 'startMessage.showLastSavedNotes' }],
        [{ text: 'Отмена', callback_data: 'startMessage.cancel' }]
      ]
    })
  };

  const message = await bot.sendMessage(chatId, 'Что вы хотите сделать?', options);

  bot.isWaitingForChoice = true;
  bot.lastMessageInfo = {
    message_id: message.message_id,
    chat_id: message.chat.id,
    nameOfUiMethod: 'sendStartMessage'
  };
}

module.exports = { sendStartMessage };