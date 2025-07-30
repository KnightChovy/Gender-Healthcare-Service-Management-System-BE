import Stripe from "stripe";
import { env } from "~/config/environment";
import { appointmentServices } from "./appointmentServices";
import { serviceService } from "./serviceService";
import { emailService } from "./emailService";
import { MODELS } from "~/models/initModels";
const stripe = Stripe(env.STRIPE_SECRET_KEY);

const paymentSession = async (user_id, price, appointment_id) => {
  console.log("price", price);
  if (!price || typeof price !== "number") {
    throw new Error("Giá trị price không hợp lệ");
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Đặt lịch tư vấn",
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    success_url: "http://localhost:5173/success",
    cancel_url: "http://localhost:5173/cancel",
    metadata: {
      user_id: user_id,
      appointment_id: appointment_id,
      type: "appointment",
    },
  });
  return session;
};

const paymentOrder = async (user_id, order_id, services) => {
  if (!order_id || !Array.isArray(services) || services.length === 0) {
    throw new Error("Thông tin đơn hàng không hợp lệ");
  }

  const line_items = services.map((service) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: service.name,
      },
      unit_amount: service.price,
    },
    quantity: service.quantity || 1,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    success_url: "http://localhost:5173/success-order",
    cancel_url: "http://localhost:5173/cancel-order",
    metadata: {
      user_id: user_id,
      order_id: order_id,
      type: "order",
    },
  });
  return session;
};

const stripeWebhookService = (req, res) => {
  console.log("Nhận webhook Stripe");

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const session = event.data.object;
  const type = session.metadata?.type;
  switch (event.type) {
    case "checkout.session.completed": {
      console.log("Checkout session completed:", session.id);
      console.log("Metadata:", session.metadata);
      if (type === "appointment") {
        const appointment_id = session.metadata?.appointment_id;
        if (appointment_id) {
          appointmentServices.handlePaymentAppoinment(appointment_id);
        } else {
          console.warn("Không tìm thấy appointment_id trong metadata.");
        }
      } else if (type === "order") {
        const order_id = session.metadata?.order_id;
        if (order_id) {
          // Xử lý đơn hàng nếu cần
          serviceService.handlePaymentOrder(order_id);
        } else {
          console.warn("⚠️ Không tìm thấy order_id trong metadata.");
        }
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
  stripeWebhookService,
  paymentOrder,
  // paymentSessionService,
};
