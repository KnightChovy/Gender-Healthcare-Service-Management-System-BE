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
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'User ID is required',
      });
    }

    console.log(`Sending service booking summary email for user: ${user_id}`);

    const response = await emailService.sendUserServicesSummaryEmail(user_id);

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
      message: 'Email thông báo đặt dịch vụ đã được gửi thành công',
      data: {
        emailSent: true,
        user_id,
        sentTo: response.sentTo,
      },
    });
  } catch (error) {
    console.error('Error in sendBookingServiceSuccess:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Internal server error while sending email',
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
};
