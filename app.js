const express = require('express')
const cors = require('cors')
const logger = require('./utils/logger.js')
const middleware = require('./utils/middleware.js')
const config = require('./utils/config.js')

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())


app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
