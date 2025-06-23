import { paymentService } from '~/services/paymentService'; 

const createCheckoutSession = async (req, res) => {
  try {
    const { user_id, price } = req.body
    const session = paymentService.session(user_id, price)
    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Có lỗi xảy ra' });
  }
};

export const paymentController = {
  createCheckoutSession
}
