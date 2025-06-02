import express from 'express'
import cors from 'cors'
import { CONNECT_DB } from './config/mysql'
import { env } from './config/environment.js'
import { API_V1 } from '~/routes/v1/index'
import { authController } from '~/controllers/authController'
const app = express()

const startServer = () => {
  // Middlewares
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cors())

  // Routes
  app.get('/', (req, res) => {
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.use('/v1', API_V1)

  app.post('/login', authController.login)

  app.listen(8017, 'localhost', () => {
    // eslint-disable-next-line no-console
    // console.log(`I am running at ${env.HOST_NAME}:${env.PORT}/`)
    console.log(`I am running at ${env.PORT}`)

  })

}

(async () => {
  try {
    console.log('connecting mysql...')
    await CONNECT_DB()
    startServer()
    console.log('connected to mysql')
  } catch (error) {
    console.error('Error connecting to MySQL:', error)
    process.exit(1)
  }
})()

