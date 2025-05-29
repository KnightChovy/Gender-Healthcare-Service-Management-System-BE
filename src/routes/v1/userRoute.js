import express from 'express'
import { StatusCodes } from 'http-status-codes'
const Router = express.Router()
import { userController } from '~/controllers/userController'
Router.route('/')
  .get(userController.getAllUsers)
  .post((req, res) => {
    res.status(StatusCodes.CREATED).json({ message: 'API create new user' })
  })

export const userRoutes = Router