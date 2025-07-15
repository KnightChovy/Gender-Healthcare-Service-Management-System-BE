import express from 'express';
import { testResultController } from '../../controllers/testResultController';
import isAuth from '~/middlewares/isAuthMiddleware';

const Router = express.Router();

Router.get('/', testResultController.getAll);
Router.get('/:id', testResultController.getById);
Router.post('/create', testResultController.create);
Router.post('/create-testResult', isAuth, testResultController.createMySqlResults);

export const testResultRoute = Router; 