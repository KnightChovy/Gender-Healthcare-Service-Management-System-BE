import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userController } from '~/controllers/userController'

const Router = express.Router()

// User routes
Router.route('/')
  .get(userController.getAllUsers)
  // .post(userController.createUser)

// Router.route('/:id')
//   .get(userController.getUserById)
//   .put(userController.updateUser)
//   .delete(userController.deleteUser)

// // User profile routes
// Router.get('/profile/me', userController.getMyProfile)
// Router.put('/profile/me', userController.updateMyProfile)
// Router.put('/profile/change-password', userController.changePassword)

export const userRoutes = Router