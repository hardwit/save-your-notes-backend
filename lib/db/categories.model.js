const mongoose = require('./connect');

const CategoriesSchema = new mongoose.Schema({
  name: String
});

const Categories = mongoose.model('Categories', CategoriesSchema);

module.exports = { CategoriesSchema, Categories };