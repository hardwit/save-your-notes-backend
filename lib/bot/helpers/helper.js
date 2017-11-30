class Helper {
  constructor() {
    if (Helper.instance) {
      return Helper.instance
    }

    Helper.instance = this

    this.state = {}
  }

  updateState(chatId, state = {}) {
    if (Array.isArray(this.state[chatId])) {
      this.state[chatId].push({ ...state })
    } else {
      this.state[chatId] = [{ ...state }]
    }
  }

  addState(chatId, messageId, messageData, status, callback) {
    this.updateState(chatId, {
      status,
      messageId,
      messageData: { ...messageData, isSavedState: true },
      callback
    })
  }

  removeLastState(chatId) {
    this.state[chatId].pop()
  }

  resetState(chatId) {
    this.state[chatId] = []
  }

  getChatState(chatId) {
    const currentState = this.state[chatId]

    return Array.isArray(currentState) && currentState[currentState.length - 1]
      ? {
          ...currentState[currentState.length - 1],
          messageData: { ...currentState[currentState.length - 1].messageData }
        }
      : null
  }

  getPrevChatState(chatId) {
    const currentState = this.state[chatId]

    return Array.isArray(currentState) && currentState[currentState.length - 2]
      ? {
          ...currentState[currentState.length - 2],
          messageData: { ...currentState[currentState.length - 2].messageData }
        }
      : null
  }

  checkWaitingStatus(chatId) {
    const currentState = this.state[chatId]

    if (!Array.isArray(currentState) || currentState.length === 0) {
      return 'default'
    }

    return currentState[currentState.length - 1].status
  }

  saveNewNote(chatId, note) {
    if (!Array.isArray(this.state[chatId])) {
      this.state[chatId] = []
    }

    this.state[chatId].savedNote = note
  }

  getSavedNote(chatId) {
    return this.state[chatId].savedNote
  }
}

const helper = new Helper()

export default helper
