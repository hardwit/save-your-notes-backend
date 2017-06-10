import { UserCategories } from './../db';

export default class UserCategoriesService {
  static async createNewUser(username) {
    let isUserAlreadyCreated = false;

    await UserCategories.findOne({ username }, 'username', (err, user) => {
      if (user) {
        isUserAlreadyCreated = true;
      }
    });

    if (!isUserAlreadyCreated) {
      const userCategories = new UserCategories({ username });
      await userCategories.save();
    }
  }
}

