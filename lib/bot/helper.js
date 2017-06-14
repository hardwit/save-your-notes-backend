class Helper {
  constructor() {
    this.state = {};

    if (Helper.instance) {
      return Helper.instance;
    }

    Helper.instance = this;
  }

  updateState(chatId, state = {}) {
    const currentState = this.state.chatId;

    this.state[chatId] = Array.isArray(currentState) ? state.push({...state}) : [{...state}];
  }

  setWaitingState(chatId, messageId, status, callback) {
    this.updateState(chatId, { status, messageId, callback });
  }

  resetWaitingState(chatId) {
    this.state[chatId].pop();
  }

  getChatState(chatId) {
    return this.state[chatId][this.state[chatId].length - 1];
  }

  getPrevChatState() {

  }

  checkWaitingStatus(chatId) {
    const currentState = this.state[chatId];

    if (currentState === undefined || currentState.length === 0) {
      return 'default';
    }

    return currentState[currentState.length - 1].status;
  }
}

const helper = new Helper();

export default helper;
