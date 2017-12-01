import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import passport from 'passport'
import http from 'http'
import PassportConfig from './passport'
import config from './../config'
import routes from './routes'
const log = require('./../log')(module)

PassportConfig(passport)

const app = express()

app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use(passport.initialize())

app.set('secret', config.get('server:secret'))
routes(app)

const httpServer = http.createServer(app)

httpServer.listen(8080)
log.info('Server has started.')
