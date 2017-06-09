const { UserCategories } = require('./../db');

class UserCategoriesService {
  static async createNewUser(username) {
    const userCategories = new UserCategories({ username });

    return await userCategories.save();
  }
}

module.exports = UserCategoriesService;
