import express from 'express';
import { paymentController } from '~/controllers/paymentController';

const router = express.Router();
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.stripeWebhook);
router.post('/create-checkout-session', express.json(), paymentController.createCheckoutSession);
export const stripeRoute = router