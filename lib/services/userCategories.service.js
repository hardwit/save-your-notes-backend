const log = require('./../log')(module)
import { UserCategories } from './../db'
import _ from 'lodash'

export default class UserCategoriesService {
  static async createNewUser(userId) {
    try {
      let isUserAlreadyCreated = false

      await UserCategories.findOne({ userId }, 'userId', (err, user) => {
        if (user) {
          isUserAlreadyCreated = true
        }
      })

      if (!isUserAlreadyCreated) {
        const userCategories = new UserCategories({ userId })
        await userCategories.save()
      }
    } catch (error) {
      log.error(error)
    }
  }

  static async addNewCategory(userId, categoryName) {
    let isCategoryAlreadyCreated = false

    try {
      await UserCategories.findOne({ userId }, (err, user) => {
        if (_.find(user.categories, { name: categoryName })) {
          isCategoryAlreadyCreated = true
        } else {
          isCategoryAlreadyCreated = false

          user.categories.push({ name: categoryName })
          user.save()
        }
      })
    } catch (error) {
      log.error(error)
    }

    return isCategoryAlreadyCreated
  }

  static async getCategoriesList(userId) {
    let categoriesList = []

    try {
      await UserCategories.findOne({ userId }, (err, user) => {
        categoriesList = categoriesList.concat(user.categories)
      })
    } catch (error) {
      log.error(error)
    }

    return categoriesList
  }

  static async addNewNote(userId, categoryName, note) {
    try {
      await UserCategories.findOne({ userId }, (err, user) => {
        const notes = _.find(user.categories, { name: categoryName }).notes

        if (user.lastNotes.length === 20) {
          user.lastNotes.shift()
        }

        user.lastNotes.push(note)
        notes.push(note)
        user.save()
      })
    } catch (error) {
      log.error(error)
    }
  }

  static async getNotes(userId, categoryName) {
    let notes = []

    try {
      await UserCategories.findOne({ userId }, (err, user) => {
        notes = _.find(user.categories, { name: categoryName }).notes
      })
    } catch (error) {
      log.error(error)
    }

    return notes
  }

  static async getLastNotes(userId) {
    let notes = []

    try {
      await UserCategories.findOne({ userId }, (err, user) => {
        notes = user.lastNotes
      })
    } catch (error) {
      log.error(error)
    }

    return notes
  }
}
