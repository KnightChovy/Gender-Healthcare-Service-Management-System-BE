import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { userController } from '~/controllers/userController';
import isAuth from '~/middlewares/isAuthMiddleware';
import {
  validateChangePassword,
  validateCreateUser,
  validateUpdateUser,
} from '~/validations/userValidation';
const Router = express.Router();

// User routes
Router.route('/')
  .get(userController.getAllUsers)
  .post(validateCreateUser, userController.createUser);

Router.route('/:id')
  //   .get(userController.getUserById)
  .put(validateUpdateUser, userController.updateUser)
  .patch(isAuth, validateChangePassword, userController.changePassword);

//   .delete(userController.deleteUser)

// // User profile routes
// Router.get('/profile/me', userController.getMyProfile)
// Router.put('/profile/me', userController.updateMyProfile)
// Router.put('/profile/change-password', userController.changePassword)

export const userRoutes = Router;
