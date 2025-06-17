import express from 'express';
import { doctorController } from '~/controllers/doctorController';
import isAuth from '~/middlewares/isAuthMiddleware';
import { cacheMiddleware } from '~/middlewares/cacheMiddleware.js';

const Router = express.Router();

Router.route('/').get(
  cacheMiddleware('doctor', 300),
  doctorController.getAllDoctors
);

Router.route('/schedule').post(isAuth, doctorController.chooseSchedule);

export const doctorRoutes = Router;
