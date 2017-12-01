import mongoose from 'mongoose'
const log = require('./../log')(module)
import config from './../config'

mongoose.connect(config.get('mongoose:uri'))

mongoose.Promise = Promise

mongoose.connection.on('error', function(err) {
  log.error('connection error:', err.message)
})

mongoose.connection.once('open', function callback() {
  log.info('Connected to DB!')
})

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    log.error('BudgetManager terminated, connection closed')
    process.exit(0)
  })
})

export default mongoose
