import { CategoriesSchema } from './categories.model'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  categories: [CategoriesSchema]
})

UserSchema.pre('save', function(next) {
  const user = this

  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (error, salt) => {
      if (error) return next(error)

      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) return next(error)

        user.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

UserSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, (error, matches) => {
    if (error) return callback(error)
    
    callback(null, matches)
  })
}

const User = mongoose.model('User', UserSchema)

export default User
