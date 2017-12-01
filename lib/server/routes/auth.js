import api from './../api'
import { User } from '../../db/index';

const authRoutes = app => {
  app.route('/').get((req, res) => res.send('API'))
  app.route('/api/auth').post(api.login(User))
}

export default authRoutes
