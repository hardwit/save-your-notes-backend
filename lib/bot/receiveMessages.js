const log = require('./../log')(module);
const UserCategoriesService = require('./../services/userCategories.service');

const globalCommands = ['/start', '/help', '/settings'];

const isGlobalCommand = (command) => globalCommands.includes(command);

const handleMessage = (msg) => isGlobalCommand(msg.text) ? handleGlobalCommand(msg) : processMessage(msg);

function handleGlobalCommand({ from, chat, text }) {
  switch (text) {
    case '/start': UserCategoriesService.createNewUser(from.username);
    break;
    default: log.error(`${text} is not Global Command`);
  }
}

function processMessage(msg) {

}

module.exports = handleMessage;

