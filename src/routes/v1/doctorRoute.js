import express from 'express';
import { doctorController } from '~/controllers/doctorController';
import isAuth from '~/middlewares/isAuthMiddleware';
import isDoctor from '~/middlewares/isDoctorMiddleware';
import { cacheMiddleware } from '~/middlewares/cacheMiddleware.js';

const Router = express.Router();

Router.route('/').get(
  cacheMiddleware('doctor', 300),
  doctorController.getAllDoctors
);

// A doctor can only create a schedule for themselves
Router.route('/schedule').post(isAuth, isDoctor, doctorController.chooseSchedule);

Router.route('/:doctor_id/available-timeslots').get(
  isAuth,
  doctorController.getAvailableTimeslots
);
export const doctorRoute = Router;
