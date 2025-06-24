import Stripe from 'stripe';
import { env } from '~/config/environment'
import { appointmentServices } from './appointmentServices';
const stripe = Stripe(env.STRIPE_SECRET_KEY);

const paymentSession = async (user_id, price, appointment_id) => {
  console.log('price', price)
  if (!price || typeof price !== 'number') {
    throw new Error('Giá trị price không hợp lệ');
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Đặt lịch tư vấn',
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    success_url: 'http://localhost:5173/success',
    cancel_url: 'http://localhost:5173/cancel',
    metadata: {
      user_id: user_id,
      appoiment_id: appointment_id
    }
  });
  return session

}

const stripeWebhookService = (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  const appoiment_id = event.metadata.appoiment_id;

  let session;
  // Handle the event
  console.log(event.type)
  switch (event.type) {
    case 'checkout.session.completed':
      session = event.data.object;
      appointmentServices.handlePaymentAppoinment(appoiment_id)
      console.log('Checkout session completed:');
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};

export const paymentService = {
  paymentSession,
  stripeWebhookService
}
