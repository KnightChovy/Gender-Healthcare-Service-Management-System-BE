import express from 'express';
import { paymentController } from '~/controllers/paymentController';

const router = express.Router();

router.post('/create-checkout-session', paymentController.createCheckoutSession);

export const stripeRoute = router