import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { userController } from '~/controllers/userController';
import { cacheMiddleware } from '~/middlewares/cacheMiddleware';
import isAuth from '~/middlewares/isAuthMiddleware';
import isUser from '~/middlewares/isUserMiddleware';
import {
  validateChangePassword,
  validateCreateUser,
  validateUpdateUser,
} from '~/validations/userValidation';
const Router = express.Router();

Router.route('/')
  .get(userController.getAllUsers)
  .post(validateCreateUser, userController.createUser);

Router.route('/profile/me').get(
  isAuth,
  cacheMiddleware('user:profile', 300),
  userController.getMyProfile
);

Router.route('/:id')
  //   .get(userController.getUserById)
  .put(isAuth, validateUpdateUser, userController.updateUser)
  .patch(isAuth, validateChangePassword, userController.changePassword);

Router.route('/:id/services').get(
  isAuth,
  isUser,
  userController.getServicesByUserId
);
//   .delete(userController.deleteUser)

Router.route('/cancel-appointment').post(
  isAuth,
  userController.cancelAppointment
);
// // User profile routes
// Router.get('/profile/me', userController.getMyProfile)
// Router.put('/profile/me', userController.updateMyProfile)
// Router.put('/profile/change-password', userController.changePassword)

export const userRoute = Router;
