import express from 'express';
import { userController } from '~/controllers/userController';
import isAdmin from '~/middlewares/isAdminMiddleware';
import isAuth from '~/middlewares/isAuthMiddleware';
import { validateCreateStaff } from '~/validations/userValidation';
const Router = express.Router();

//admin route
Router.route('/createStaff')
  .post(isAuth, isAdmin, validateCreateStaff, userController.createStaff);

export const adminRoute = Router; 