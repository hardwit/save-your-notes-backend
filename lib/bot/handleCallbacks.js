import * as ui from './ui';
import {
  START_MESSAGE_CHOSE_CATEGORY,
  START_MESSAGE_CREATE_CATEGORY,
  START_MESSAGE_SHOW_LAST_SAVED_NOTES,
  EXIT,
  BACK
} from './helpers/constants';

const onCallbackQuery = ({ data, message }) => {
  switch (data) {
    case START_MESSAGE_CREATE_CATEGORY:
      ui.createNewCategory(message.chat.id, message.chat.id);
      break;
    case START_MESSAGE_CHOSE_CATEGORY:
      ui.showCategoriesList(message.chat.id, message.chat.id);
      break;
    case START_MESSAGE_SHOW_LAST_SAVED_NOTES:
      break;
    case BACK:
      ui.back(message.chat.id);
      break;
    case EXIT:
      ui.exit(message.chat.id, message.message_id);
      break;
    default:
  }
};

export default onCallbackQuery;