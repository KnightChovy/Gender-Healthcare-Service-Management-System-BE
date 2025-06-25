import Stripe from 'stripe';
import { env } from '~/config/environment'
import { appointmentServices } from './appointmentServices';
import { emailService } from './emailService';
import { MODELS } from '~/models/initModels'
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
      appointment_id: appointment_id
    }
  });
  return session

}

// const stripeWebhookService = (req, res) => {
//   console.log('da vo day roi ne')
//   const sig = req.headers['stripe-signature'];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.error('Webhook signature verification failed.', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }
//   const session = event.data.object;
//   const appoiment_id = event.metadata.appoiment_id;

//   console.log(event.type)
//   switch (event.type) {
//     case 'checkout.session.completed':
//       appointmentServices.handlePaymentAppoinment(appoiment_id)
//       console.log('Checkout session completed:');
//       break;
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   res.json({ received: true });
// };

const stripeWebhookService = (req, res) => {
  console.log('🎯 Nhận webhook Stripe');

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const session = event.data.object;
  const user_id = session.metadata?.user_id;

  const user = MODELS.user.findOne({ where: { user_id: user_id } })
  switch (event.type) {
    case 'checkout.session.completed': {
      console.log('✅ Checkout session completed:', session.id);
      console.log('🔍 Metadata:', session.metadata);

      const appointment_id = session.metadata?.appointment_id;
      if (appointment_id) {
        appointmentServices.handlePaymentAppoinment(appointment_id);
        if (user) {
          const gmail = emailService.sendBookingConfirmation(user.user_id, user)
        }
      } else {
        console.warn('⚠️ Không tìm thấy appointment_id trong metadata.');
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

export const paymentService = {
  paymentSession,
  stripeWebhookService
}
