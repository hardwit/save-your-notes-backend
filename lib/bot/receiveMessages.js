const log = require('./../log')(module);

import helper from './helper';
import * as ui from './ui';
import UserCategoriesService from './../services/userCategories.service';

const globalCommands = ['/start', '/help', '/settings'];

const isGlobalCommand = (command) => globalCommands.includes(command);

export default function handleMessage(msg) {
  const chatId = msg.chat.id;
  const waitingStatus = helper.checkWaitingStatus(chatId);

  if (waitingStatus === 'waitingForChoice') {
    ui.reSendLastMessage(chatId);

    return;
  }

  if (waitingStatus === 'waitingForInput') {
    helper.getChatState(chatId).callback(msg.text);
  }

  isGlobalCommand(msg.text) ? handleGlobalCommand(msg) : processMessage(msg);
}

function handleGlobalCommand({ from, chat, text }) {
  switch (text) {
    case '/start':
      UserCategoriesService.createNewUser(from.id) ;
      ui.sendStartMessage(chat.id);
      break;
    default:
      log.error(`${text} is not Global Command`);
  }
}

function processMessage(msg) {

}


