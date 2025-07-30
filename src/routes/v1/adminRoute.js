import express from 'express';
import { adminController } from '~/controllers/adminController';
import isAdmin from '~/middlewares/isAdminMiddleware';
import isAuth from '~/middlewares/isAuthMiddleware';
import { validateCreateStaff } from '~/validations/userValidation';
const Router = express.Router();

Router.route('/createStaff').post(
  isAuth,
  isAdmin,
  validateCreateStaff,
  adminController.createStaff
);
Router.route('/deleteStaff').patch(
  isAuth,
  isAdmin,
  adminController.deleteStaff
);

export const adminRoute = Router;
