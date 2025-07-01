import express from 'express';
import { serviceController } from '~/controllers/serviceController';
import isAuth from '~/middlewares/isAuthMiddleware';
import isUser from '~/middlewares/isUserMiddleware';

const Router = express.Router();

Router.get('/', serviceController.getAllServices);
Router.post('/bookingService', isAuth, isUser, serviceController.bookingService);

export const serviceRoute = Router; 