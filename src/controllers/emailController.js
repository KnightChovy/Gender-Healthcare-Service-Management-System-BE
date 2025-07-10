import { emailService } from '~/services/emailService';
import { StatusCodes } from 'http-status-codes';

const sendEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'The email is required',
      });
    }

    console.log(`Attempting to send email to: ${email}`);
    const response = await emailService.sendEmail(email);

    if (response.status === 'error') {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.error('Error in email controller:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Internal server error while sending email',
      error: error.message,
    });
  }
};

const sendPaymentReminder = async (req, res) => {
  try {
    const { appointment_id } = req.body;

    if (!appointment_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'appointment_id is required',
      });
    }

    console.log(
      `Sending payment reminder email for appointment: ${appointment_id}`
    );

    // Gọi service với chỉ appointment_id, service sẽ xử lý tất cả các logic
    const response = await emailService.sendPaymentReminderEmail(
      appointment_id
    );

    if (response.status === 'error') {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Payment reminder email sent successfully',
      data: {
        emailSent: true,
        appointmentId: appointment_id,
        sentTo: response.sentTo,
        paymentLink: response.paymentLink,
      },
    });
  } catch (error) {
    console.error('Error in sendPaymentReminder:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Internal server error while sending email',
      error: error.message,
    });
  }
};

const sendBookingConfirmation = async (req, res) => {
  try {
    const { appointment_id } = req.body;

    if (!appointment_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'appointment_id is required',
      });
    }

    console.log(
      `Sending booking confirmation email for appointment: ${appointment_id}`
    );

    const response = await emailService.sendBookingConfirmationEmail(
      appointment_id
    );

    if (response.status === 'error') {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Booking confirmation email sent successfully',
      data: {
        emailSent: true,
        appointmentId: appointment_id,
        sentTo: response.sentTo,
      },
    });
  } catch (error) {
    console.error('Error in sendBookingConfirmation:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Internal server error while sending email',
      error: error.message,
    });
  }
};

const sendAppointmentFeedbackEmail = async (req, res) => {
  try {
    const { appointment_id } = req.body;

    if (!appointment_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'appointment_id is required',
      });
    }

    console.log(
      `Sending feedback request email for appointment: ${appointment_id}`
    );

    const response = await emailService.sendAppointmentFeedbackEmail(
      appointment_id
    );

    if (response.status === 'error') {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Email đánh giá cuộc hẹn đã được gửi thành công',
      data: {
        emailSent: true,
        appointmentId: appointment_id,
        sentTo: response.sentTo,
        feedbackLink: response.feedbackLink,
      },
    });
  } catch (error) {
    console.error('Error in sendAppointmentFeedbackEmail:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Lỗi server khi gửi email đánh giá cuộc hẹn',
      error: error.message,
    });
  }
};

const sendEmailForgetPassword = async (req, res) => {
  try {
    const { username, email } = req.body;

    const response = emailService.sendEmailForgetPassword(username, email);

    if (response.status === 'error') {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Email gửi mã OTP đã được gửi thành công',
      data: {
        emailSent: true,
        sentTo: response.sentTo,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Lỗi server',
      error: error.message,
    });
  }
};

const sendBookingServiceSuccess = async (req, res) => {
  try {
    const { user_id, order_id } = req.body;

    if (!user_id || !order_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'User ID và Order ID là bắt buộc',
      });
    }

    console.log(
      `Sending booking service success email for order: ${order_id}, user: ${user_id}`
    );

    const response = await emailService.sendBookingServiceSuccessEmail(
      user_id,
      order_id
    );

    if (response.status === 'error') {
      const statusCode = response.message.includes('Không tìm thấy')
        ? StatusCodes.NOT_FOUND
        : StatusCodes.INTERNAL_SERVER_ERROR;

      return res.status(statusCode).json({
        status: 'error',
        message: response.message,
      });
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Email thông báo đặt dịch vụ thành công đã được gửi',
      data: {
        emailSent: true,
        user_id,
        order_id,
        sentTo: response.sentTo,
      },
    });
  } catch (error) {
    console.error('Error in sendBookingServiceSuccess controller:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Lỗi server khi gửi email',
      error: error.message,
    });
  }
};

const sendOrderCancellationNotification = async (req, res) => {
  try {
    const { order_id, user_id, reason } = req.body;

    if (!order_id || !user_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Thiếu thông tin bắt buộc (order_id, user_id)',
      });
    }

    console.log(
      `Sending order cancellation email for order: ${order_id}, user: ${user_id}`
    );

    const response = await emailService.sendOrderCancellationEmail(
      order_id,
      user_id,
      reason
    );

    if (response.status === 'error') {
      const statusCode = response.message.includes('Không tìm thấy')
        ? StatusCodes.NOT_FOUND
        : StatusCodes.INTERNAL_SERVER_ERROR;

      return res.status(statusCode).json({
        status: 'error',
        message: response.message,
      });
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Email thông báo hủy đơn hàng đã được gửi thành công',
      data: {
        emailSent: true,
        order_id,
        user_id,
        sentTo: response.sentTo,
      },
    });
  } catch (error) {
    console.error('Error in sendOrderCancellationNotification:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).json({
      status: 'error',
      message:
        error.message || 'Lỗi server khi gửi email thông báo hủy đơn hàng',
      error: error.message,
    });
  }
};

const sendAppointmentCancellationNotification = async (req, res) => {
  try {
    const { appointment_id, reason } = req.body;

    if (!appointment_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Thiếu thông tin cuộc hẹn (appointment_id)',
      });
    }

    console.log(
      `Sending appointment cancellation email for appointment: ${appointment_id}`
    );

    const response = await emailService.sendAppointmentCancellationEmail(
      appointment_id,
      reason
    );

    if (response.status === 'error') {
      const statusCode = response.message.includes('Không tìm thấy')
        ? StatusCodes.NOT_FOUND
        : StatusCodes.INTERNAL_SERVER_ERROR;

      return res.status(statusCode).json({
        status: 'error',
        message: response.message,
      });
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Email thông báo hủy cuộc hẹn đã được gửi thành công',
      data: {
        emailSent: true,
        appointment_id,
        sentTo: response.sentTo,
      },
    });
  } catch (error) {
    console.error('Error in sendAppointmentCancellationNotification:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).json({
      status: 'error',
      message:
        error.message || 'Lỗi server khi gửi email thông báo hủy cuộc hẹn',
      error: error.message,
    });
  }
};

export const emailController = {
  sendEmail,
  sendPaymentReminder,
  sendBookingConfirmation,
  sendAppointmentFeedbackEmail,
  sendEmailForgetPassword,
  sendBookingServiceSuccess,
  sendOrderCancellationNotification,
  sendAppointmentCancellationNotification,
};
