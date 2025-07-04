import express from 'express';
import { doctorController } from '~/controllers/doctorController';
import { appointmentController } from '~/controllers/appointmentController';
import isAuth from '~/middlewares/isAuthMiddleware';
import isDoctor from '~/middlewares/isDoctorMiddleware';
import { cacheMiddleware } from '~/middlewares/cacheMiddleware.js';
import { validateUpdateDoctor } from '~/validations/userValidation';

const Router = express.Router();

Router.route('/').get(
  cacheMiddleware('doctor', 300),
  doctorController.getAllDoctors
);
Router.route('/profile').get(isAuth, isDoctor, doctorController.getDoctorByID);

Router.route('/:doctor_id').patch(
  isAuth,
  validateUpdateDoctor,
  doctorController.updateDoctorProfile
);

Router.route('/schedule').post(
  isAuth,
  isDoctor,
  doctorController.chooseSchedule
);

Router.route('/:doctor_id/available-timeslots').get(
  isAuth,
  doctorController.getAvailableTimeslots
);

Router.route('/:doctor_id/appointments').get(
  isAuth,
  isDoctor,
  appointmentController.getDoctorAppointments
);

Router.route('/:doctor_id/appointments').post(
  isAuth,
  isDoctor,
  appointmentController.doctorCompleteAppointment
);

export const doctorRoute = Router;
