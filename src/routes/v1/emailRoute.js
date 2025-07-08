import express from 'express';
import { emailController } from '~/controllers/emailController';
import isAuth from '~/middlewares/isAuthMiddleware';

const Router = express.Router();

//email route
Router.route('/sendEmail').post(emailController.sendEmail);
Router.route('/payment-reminder').post(emailController.sendPaymentReminder);
Router.route('/booking-confirmation').post(
  emailController.sendBookingConfirmation
);
Router.route('/appointment-feedback').post(
  emailController.sendAppointmentFeedbackEmail
);
Router.route('/forget-password').post(emailController.sendEmailForgetPassword);

Router.route('/user/:user_id').post(
  // isAuth,
  emailController.sendBookingServiceSuccess
);
export const emailRoute = Router;
