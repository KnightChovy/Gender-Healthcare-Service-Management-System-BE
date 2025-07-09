import express from 'express';
import { testResultController } from '../../controllers/testResultController';

const Router = express.Router();

Router.get('/', testResultController.getAll);
Router.get('/:id', testResultController.getById);
Router.post('/create', testResultController.create);

export const testResultRoute = Router; 