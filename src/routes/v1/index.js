import express from 'express'
import { StatusCodes } from 'http-status-codes'
const Router = express.Router()
import { userRoutes } from '~/routes/v1/userRoute'
console.log('API status check')
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'API is running' })
})

Router.use('/user', userRoutes)

export const API_V1 = Router