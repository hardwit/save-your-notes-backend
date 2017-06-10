class Helper {
  constructor() {
    this.state = {}
  }

  setState(chatId, state = {}) {
    this.state[chatId] = {...state}
  }

  setWaitingState(chatId, messageId, uiMethod) {
    this.setState(chatId, { isWaitingForChoice: true, messageId, uiMethod });
  }

  resetWaitingState(chatId) {
    this.setState(chatId, { isWaitingForChoice: false })
  }

  getChatState(chatId) {
    return this.state[chatId];
  }

  checkWaitingStatus(chatId) {
    if (this.state[chatId] === undefined) {
      this.setState(chatId, { isWaitingForChoice: false });
    }

    return this.state[chatId].isWaitingForChoice;
  }
}

const helper = new Helper();

export default helper;
