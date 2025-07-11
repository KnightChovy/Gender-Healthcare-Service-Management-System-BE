import express from 'express';
import { emailController } from '~/controllers/emailController';
// import isAuth from '~/middlewares/isAuthMiddleware';

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

Router.route('/booking-service-success').post(
  emailController.sendBookingServiceSuccess
);

Router.route('/send-order-cancellation').post(
  emailController.sendOrderCancellationNotification
);
Router.route('/send-appointment-cancellation').post(
  emailController.sendAppointmentCancellationNotification
);
Router.route('/test-completion-notification').post(
  emailController.sendTestCompletionNotification
);

export const emailRoute = Router;
