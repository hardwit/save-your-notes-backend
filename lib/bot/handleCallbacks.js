import * as ui from './ui';
import {
  START_MESSAGE_CHOSE_CATEGORY,
  START_MESSAGE_CREATE_CATEGORY,
  START_MESSAGE_SHOW_LAST_SAVED_NOTES,
  START_MESSAGE_CANCEL
} from './callbackData';

const onCallbackQuery = ({ data, message }) => {
  switch (data) {
    case START_MESSAGE_CREATE_CATEGORY: ui.createNewCategory(message.chat.id, message.chat.id);
    break;
    case START_MESSAGE_CHOSE_CATEGORY: () => {};
      break;
    case START_MESSAGE_SHOW_LAST_SAVED_NOTES: () => {};
      break;
    case START_MESSAGE_CANCEL: ui.removeLastMessage(message.chat.id);
      break;
    default: () => {};
  }
};

export default onCallbackQuery;