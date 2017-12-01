import passport from 'passport'
import api from './../api'
import { User } from '../../db/index'
import config from './../../config'

const authRoutes = app => {
  app.route('/').get((req, res) => res.send('API is ready'))

  app.route('/api/auth').post(api.signIn(User))

  app.route('/api/setup').post(api.setAdminProfile(User))

  app.route('/api/signup').post(api.signUp(User))

  app
    .route('/api/users')
    .get(
      passport.authenticate('jwt', config.get('server:session')),
      api.getAllUsers(User, app.get('secret'))
    )
}

export default authRoutes
