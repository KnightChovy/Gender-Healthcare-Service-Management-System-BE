import express from 'express';
import isAuth from '~/middlewares/isAuthMiddleware';
import isManager from '~/middlewares/isManagerMiddleware';
import { appointmentController } from '~/controllers/appointmentController'
const Router = express.Router();

// Placeholder route - you can add more manager-specific routes here
Router.get('/dashboard', isAuth, isManager, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the manager dashboard!',
  });
});
Router.get('/appoinments', isAuth, isManager, appointmentController.getAllAppointments)

export const managerRoute = Router; 