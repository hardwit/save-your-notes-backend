import { UserCategories } from './../db';

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
}

