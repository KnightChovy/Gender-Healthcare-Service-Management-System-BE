import express from 'express';
import { sendEmailController } from '~/controllers/emailController';

const Router = express.Router();

// User routes
Router.route('/sendEmail').post(sendEmailController);

export const emailRoute = Router;
