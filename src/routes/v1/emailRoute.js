import express from 'express';
import { emailController } from '~/controllers/emailController';

const Router = express.Router();

// User routes
Router.route('/sendEmail').post(emailController.sendEmail);
Router.route('/payment-reminder').post(emailController.sendPaymentReminder);

export const emailRoute = Router;
