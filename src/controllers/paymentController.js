import { paymentService } from '~/services/paymentService'; 

const createCheckoutSession = async (req, res) => {
  try {
    const { user_id, price, appointment_id } = req.body
    const session = await paymentService.paymentSession(user_id, price, appointment_id)
    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Có lỗi xảy ra' });
  }
};

export const stripeWebhook = (req, res) => {
  return paymentService.stripeWebhookService(req, res);
};

export const paymentController = {
  createCheckoutSession,
  stripeWebhook 
}
