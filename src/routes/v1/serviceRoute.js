import express from 'express';
import { serviceController } from '~/controllers/serviceController';

const Router = express.Router();

Router.get('/', serviceController.getAllServices);

export const serviceRoute = Router; 