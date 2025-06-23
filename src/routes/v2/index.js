import express from 'express';
import { stripeRoute } from './stripeRoute'

const Router = express.Router();
Router.use('/payment', stripeRoute)

export const API_V2 = Router