import mongoose from './connect';

export const CategoriesSchema = new mongoose.Schema({
  name: String
});

export const Categories = mongoose.model('Categories', CategoriesSchema);
