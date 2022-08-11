const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const routes = require('../routes/index.js')

const { expressjwt: jwt } = require('express-jwt')
var jwks = require('jwks-rsa')

require('./db')

const server = express()

server.name = 'API'

server.use(express.json({ limit: '50mb' }))
server.use(cors())

server.use(morgan('dev'))
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  next()
})

// JWT Middleware
var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://nnicolasg.us.auth0.com/.well-known/jwks.json',
  }),
  audience: 'ecommerceIdentifier',
  issuer: 'https://nnicolasg.us.auth0.com/',
  algorithms: ['RS256'],
}).unless({ path: ['/'] })

server.use('/', routes)

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500
  const message = err.message || err
  console.error(err)
  res.status(status).send(message)
})

module.exports = server
