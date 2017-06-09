const mongoose = require('./connect');
const { CategoriesSchema } = require('./categories.model.js');

const userCategoriesSchema = new mongoose.Schema({
  username: String,
  categories: [CategoriesSchema]
});

const UserCategories = mongoose.model('userCategories', userCategoriesSchema);

module.exports = UserCategories;
