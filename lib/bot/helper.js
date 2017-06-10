class Helper {
  constructor() {
    this.state = {}
  }

  setState(chatId, state = {}) {
    this.state[chatId] = {...state}
  }

  setWaitingState(chatId, messageId, status, callback) {
    this.setState(chatId, { status, messageId, callback });
  }

  resetWaitingState(chatId) {
    this.setState(chatId, { status: 'default' })
  }

  getChatState(chatId) {
    return this.state[chatId];
  }

  checkWaitingStatus(chatId) {
    if (this.state[chatId] === undefined) {
      this.setState(chatId, { status: 'default' });
    }

    return this.state[chatId].status;
  }
}

const helper = new Helper();

export default helper;
