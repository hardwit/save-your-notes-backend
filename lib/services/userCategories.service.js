import { UserCategories } from './../db';
import _ from 'lodash';

export default class UserCategoriesService {
  static async createNewUser(userId) {
    let isUserAlreadyCreated = false;

    await UserCategories.findOne({ userId }, 'userId', (err, user) => {
      if (user) {
        isUserAlreadyCreated = true;
      }
    });

    if (!isUserAlreadyCreated) {
      const userCategories = new UserCategories({ userId });
      await userCategories.save();
    }
  }

  static async addNewCategory(userId, categoryName) {
    let isCategoryAlreadyCreated = false;

    await UserCategories.findOne({ userId }, (err, user) => {
      if (_.find(user.categories, { name: categoryName })) {
        isCategoryAlreadyCreated = true;
      } else {
        isCategoryAlreadyCreated = false;

        user.categories.push({ name: categoryName});
        user.save();
      }
    });

    return isCategoryAlreadyCreated;
  }
}

