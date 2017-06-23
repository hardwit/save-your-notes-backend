import * as ui from './ui';
import helper from './helpers/helper';
import {
  START_MESSAGE_CHOSE_CATEGORY,
  START_MESSAGE_CREATE_CATEGORY,
  START_MESSAGE_SHOW_LAST_SAVED_NOTES,
  SELECT_CATEGORY_FOR_NOTES_GETTING,
  SELECT_CATEGORY_FOR_NOTE_ADDING,
  EXIT
} from './helpers/constants';

const onCallbackQuery = ({ data, message }) => {
  switch (data) {
    case START_MESSAGE_CREATE_CATEGORY:
      ui.createNewCategory(message.chat.id, message.chat.id);
      break;
    case START_MESSAGE_CHOSE_CATEGORY:
      ui.showCategoriesList(message.chat.id, message.chat.id, SELECT_CATEGORY_FOR_NOTES_GETTING);
      break;
    case START_MESSAGE_SHOW_LAST_SAVED_NOTES:
      break;
    case EXIT:
      ui.exit(message.chat.id, message.message_id);
      break;
    default:
      handleCustomCallback(data, message);
  }
};

export default onCallbackQuery;

function handleCustomCallback(data, message) {
  if (data.includes(SELECT_CATEGORY_FOR_NOTES_GETTING)) {
    const category = data.split('&&')[1];

    ui.showCategoryNotes(message.chat.id, message.chat.id, category);
  }

  if (data.includes(SELECT_CATEGORY_FOR_NOTE_ADDING)) {
    const category = data.split('&&')[1];
    const note = helper.getSavedNote(message.chat.id);

    ui.addNewNote(message.chat.id, message.chat.id, category, note);
  }
}