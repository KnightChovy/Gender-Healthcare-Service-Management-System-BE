import Stripe from 'stripe';
import { env } from '~/config/environment'
const stripe = Stripe(env.STRIPE_SECRET_KEY);

const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  mode: 'payment',
  line_items: [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Sản phẩm ABC',
        },
        unit_amount: 2000,
      },
      quantity: 1,
    },
  ],
  success_url: 'http://localhost:3000/success',
  cancel_url: 'http://localhost:3000/cancel',
});

export const paymentService = {
  session
}
