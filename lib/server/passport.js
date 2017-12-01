import { ExtractJwt, Strategy } from 'passport-jwt'
import config from './../config'
import { User } from '../db/index'

const PassportConfig = passport => {
  const parameters = {
    secretOrKey: config.get('server:secret'),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  }

  passport.use(
    new Strategy(parameters, (payload, done) => {
      User.findOne({ id: payload.id }, (error, user) => {
        if (error) return done(error, false)
        if (user) done(null, user)
        else done(null, false)
      })
    })
  )
}

export default PassportConfig
