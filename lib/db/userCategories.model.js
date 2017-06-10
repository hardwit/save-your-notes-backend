import mongoose from './connect';
import { CategoriesSchema } from './categories.model.js';

const userCategoriesSchema = new mongoose.Schema({
  userId: Number,
  categories: [CategoriesSchema]
});

const UserCategories = mongoose.model('userCategories', userCategoriesSchema);

export default UserCategories;
