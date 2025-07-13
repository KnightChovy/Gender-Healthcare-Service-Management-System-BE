import express from 'express';
import isAuth from '~/middlewares/isAuthMiddleware';
import { staffController } from '~/controllers/staffController';
import {
  validateUpdateOrderStatus,
  validateUpdateStaffProfile,
  validateOrderData,
} from '~/validations/staffValidation';
import { userController } from '~/controllers/userController';

const Router = express.Router();
console.log('staffRoute loaded');

// Order management routes
Router.route('/update-order').patch(isAuth, staffController.staffUpdateOrder);
Router.route('/orders/pending').get(isAuth, staffController.getPendingOrders);
Router.route('/orders/:order_id').get(isAuth, staffController.getOrderDetails);
Router.route('/orders/:order_id/status').patch(
  isAuth,
  validateUpdateOrderStatus,
  staffController.updateOrderStatus
);
Router.route('/orders/:order_id/complete').patch(isAuth, staffController.completePaidOrder);
Router.route('/orders/:order_id/cancel').patch(isAuth, staffController.cancelPendingOrder);

Router.route('/profile').get(isAuth, staffController.getStaffProfile);
Router.route('/profile').patch(
  isAuth,
  validateUpdateStaffProfile,
  staffController.updateStaffProfile
);

Router.route('/getAllOrder').get(isAuth, userController.getAllOrders);

export const staffRoute = Router;
