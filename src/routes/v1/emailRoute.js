import express from 'express';
import { emailController } from '~/controllers/emailController';

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
Router.route('/forget-password').post(
  emailController.sendEmailForgetPassword
);
export const emailRoute = Router;
