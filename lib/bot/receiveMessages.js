const log = require('./../log')(module);
const bot = require('./bot');
const ui = require('./ui');
const UserCategoriesService = require('./../services/userCategories.service');

const globalCommands = ['/start', '/help', '/settings'];

const isGlobalCommand = (command) => globalCommands.includes(command);

function handleMessage(msg) {
  if (bot.isWaitingForChoice) {
    ui.reSendLastMessage();

    return;
  }

  isGlobalCommand(msg.text) ? handleGlobalCommand(msg) : processMessage(msg);
}

function handleGlobalCommand({ from, chat, text }) {
  switch (text) {
    case '/start':
      UserCategoriesService.createNewUser(from.username) ;
      ui.sendStartMessage(chat.id);
      break;
    default:
      log.error(`${text} is not Global Command`);
  }
}

function processMessage(msg) {

}

module.exports = handleMessage;

