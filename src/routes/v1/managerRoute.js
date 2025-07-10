import express from 'express';
import isAuth from '~/middlewares/isAuthMiddleware';
import isManager from '~/middlewares/isManagerMiddleware';
import { appointmentController } from '~/controllers/appointmentController';
import { userController } from '~/controllers/userController';
const Router = express.Router();

// Placeholder route - you can add more manager-specific routes here
Router.get('/dashboard', isAuth, isManager, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the manager dashboard!',
  });
});
Router.get(
  '/appointments',
  isAuth,
  isManager,
  appointmentController.getAllAppointments
);

// Manager appointment approval routes
Router.patch(
  '/appointments/:appointmentId/approve',
  isAuth,
  isManager,
  appointmentController.approveAppointment
);
Router.patch(
  '/appointments/approve',
  isAuth,
  isManager,
  appointmentController.ApproveAppointments
);

Router.route('/getAllOrder').get(
  isAuth,
  userController.getAllOrders
);
export const managerRoute = Router;
