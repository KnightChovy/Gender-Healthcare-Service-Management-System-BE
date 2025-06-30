import express from 'express';
import { serviceController } from '~/controllers/serviceController';

const Router = express.Router();

Router.get('/', serviceController.getAllServices);
Router.post('/', serviceController.bookingService);

export const serviceRoute = Router; 