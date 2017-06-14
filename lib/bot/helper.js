class Helper {
  constructor() {
    this.state = {};

    if (Helper.instance) {
      return Helper.instance;
    }

    Helper.instance = this;
  }

  updateState(chatId, state = {}) {
    if (Array.isArray(this.state[chatId])) {
      this.state[chatId].push({ ...state })
    } else {
      this.state[chatId] = [{ ...state }];
    }
  }

  setWaitingState(chatId, messageId, status, callback) {
    this.updateState(chatId, { status, messageId, callback });
  }

  removeLastState(chatId) {
    this.state[chatId].pop();
  }

  resetState(chatId) {
    this.state[chatId] = [];
  }

  getChatState(chatId) {
    return this.state[chatId][this.state[chatId].length - 1];
  }

  getPrevChatState(chatId) {
    const currentState = this.state[chatId];

    return (Array.isArray(currentState) && currentState[currentState.length - 2]) ? currentState[currentState.length - 2] : null;
  }

  checkWaitingStatus(chatId) {
    const currentState = this.state[chatId];

    if (!Array.isArray(currentState) || currentState.length === 0) {
      return 'default';
    }

    return currentState[currentState.length - 1].status;
  }
}

const helper = new Helper();

export default helper;
