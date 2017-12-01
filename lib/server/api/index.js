import jwt from 'jsonwebtoken'
import config from './../../config'

const api = {
  login: User => (res, req) => {
    User.findOne({ username: req.body.username }, (error, user) => {
      if (error) throw error

      if (!user) {
        res.status(401).send({
          success: false,
          message: 'Authentication failed. User not found.'
        })
      } else {
        user.comparePassword(req.body.password, (error, matches) => {
          if (matches && !error) {
            const token = jwt.sign({ user }, config.get('server:secret'))
            res.json({ success: true, message: 'Token granted', token })
          } else {
            res.status(401).send({
              success: false,
              message: 'Authentication failed. Wrong password.'
            })
          }
        })
      }
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

export default api
