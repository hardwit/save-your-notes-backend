import helper from './helpers/helper'
import * as ui from './ui'
import UserCategoriesService from './../services/userCategories.service'
import {
  WAITING_FOR_CHOICE_STATUS,
  WAITING_FOR_INPUT_STATUS
} from './helpers/constants'

const globalCommands = ['/start', '/help', '/settings']

const isGlobalCommand = command => globalCommands.includes(command)

export default function handleMessage(msg) {
  const chatId = msg.chat.id
  const waitingStatus = helper.checkWaitingStatus(chatId)

  if (waitingStatus === WAITING_FOR_CHOICE_STATUS) {
    ui.exit(chatId)

    return
  }

  if (waitingStatus === WAITING_FOR_INPUT_STATUS) {
    helper.getChatState(chatId).callback(msg.text)

    return
  }

  helper.resetState(chatId)

  isGlobalCommand(msg.text) ? handleGlobalCommand(msg) : processMessage(msg)
}

function handleGlobalCommand({ from, chat, text }) {
  switch (text) {
    case '/start':
      UserCategoriesService.createNewUser(from.id)
      ui.sendStartMessage(chat.id)
      break
    default:
  }
}

function processMessage({ from, chat, text }) {
  if (text.length < 3) {
    ui.sendStartMessage(chat.id)

    return
  }

  ui.showCategoriesForNewNote(chat.id, from.id, text)
}
