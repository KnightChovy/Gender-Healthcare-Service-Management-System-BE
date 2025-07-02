import express from 'express';
import { authController } from '~/controllers/authController';
import isAuth from '~/middlewares/isAuthMiddleware';
import { validateForgetPassword } from '~/validations/userValidation';
const Router = express.Router();

// Authentication routes
Router.post('/login', authController.login);
Router.post('/refresh-token', authController.refreshToken);
Router.post('/logout', isAuth, authController.logout);
Router.patch(
  '/forget-password',
  validateForgetPassword,
  authController.forgetPassword
);
export const authRoutes = Router;
