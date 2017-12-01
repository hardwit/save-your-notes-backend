import jwt from 'jsonwebtoken'
import config from './../../config'

const auth = {
  //toDO remove later
  setAdminProfile: User => (req, res) => {
    const admin = new User({
      username: 'admin',
      password: 'admin',
      categories: []
    })

    admin.save(error => {
      if (error) throw error
      res.json({ success: true })
    })
  },

  //toDO remove later
  getAllUsers: (User, token) => (req, res) => {
    if (token) {
      User.find({}, (error, users) => {
        if (error) throw error
        res.status(200).json(users)
      })

      return
    }

    return res.status(403).send({ success: false, message: 'Unauthorized' })
  },

  signUp: User => (req, res) => {
    if (!req.body.username || !req.body.password) {
      res.json({
        success: false,
        message: 'Please, pass a username and password.'
      })

      return
    }

    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
      categories: []
    })

    newUser.save(error => {
      if (error) {
        return res
          .status(400)
          .json({ success: false, message: 'Username already exists.' })
      }

      res.json({ success: true, message: 'Account created successfully' })
    })
  },

  signIn: User => (req, res) => {
    User.findOne({ username: req.body.username }, (error, user) => {
      if (error) throw error

      if (!user) {
        res.status(401).send({
          success: false,
          message: 'Authentication failed. User not found.'
        })

        return
      }

      user.comparePassword(req.body.password, (error, matches) => {
        if (matches && !error) {
          const token = jwt.sign({ user }, config.get('server:secret'))
          res.json({ success: true, message: 'Token granted', token })

          return
        }

        res.status(401).send({
          success: false,
          message: 'Authentication failed. Wrong password.'
        })
      })
    })
  },

  verify: headers => {
    if (headers && headers.authorization) {
      const split = headers.authorization.split(' ')

      if (split.length === 2) {
        return split[1]
      }

      return null
    }

    return null
  }
}

export default auth
