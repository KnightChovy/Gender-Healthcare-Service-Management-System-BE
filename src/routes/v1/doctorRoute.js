import express from 'express';
import { doctorController } from '~/controllers/doctorController';
import { cacheMiddleware } from '~/middlewares/cacheMiddleware.js';

const Router = express.Router();

Router.route('/').get(
  cacheMiddleware('doctor', 300),
  doctorController.getAllDoctors
);

export const doctorRoutes = Router;
