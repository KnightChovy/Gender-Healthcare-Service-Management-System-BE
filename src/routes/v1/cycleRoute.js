import express from 'express'
import { cycleController } from '~/controllers/cycleController';
import isAuth from '~/middlewares/isAuthMiddleware';
const Router = express.Router();
console.log('cycleRoute loaded');
Router.route('/').post(isAuth, cycleController.cycleCulate)
Router.route('/').get(isAuth, cycleController.getCycleByUserID)

export const cycleRoute = Router
