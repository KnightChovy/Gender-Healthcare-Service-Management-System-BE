import { emailService } from '~/services/emailService';
import { StatusCodes } from 'http-status-codes';
import { MODELS } from '~/models/initModels';

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

    const appointment = await MODELS.AppointmentModel.findByPk(appointment_id);
    if (!appointment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'error',
        message: 'Appointment not found',
      });
    }

    const user = await MODELS.UserModel.findByPk(appointment.user_id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'error',
        message: 'User not found',
      });
    }

    const appointmentData = {
      patientName: user.first_name,
      consultantType: appointment.consultant_type || 'Tư vấn sức khỏe',
      fee: appointment.price_apm
        ? `${appointment.price_apm.toLocaleString('vi-VN')} VND`
        : '300.000 VND',
    };

    console.log(`Sending payment reminder email to: ${user.email}`);
    const response = await emailService.sendPaymentReminderEmail(
      user.email,
      appointmentData
    );

    if (response.status === 'error') {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Payment reminder email sent successfully',
      data: {
        emailSent: true,
        appointmentId: appointment.appointment_id,
        sentTo: user.email,
      },
    });
  } catch (error) {
    console.error('Error in sendPaymentReminder:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Internal server error while sending email',
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
    const appointment = await MODELS.AppointmentModel.findByPk(appointment_id, {
      attributes: ['appointment_id', 'user_id'],
    });

    if (!appointment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'error',
        message: 'Appointment not found',
      });
    }

    const user = await MODELS.UserModel.findByPk(appointment.user_id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'error',
        message: 'User not found',
      });
    }

    const userData = {
      patientName: user.first_name,
    };

    console.log(`Sending booking confirmation email to: ${user.email}`);
    const response = await emailService.sendBookingConfirmationEmail(
      user.email,
      userData
    );

    if (response.status === 'error') {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Booking confirmation email sent successfully',
      data: {
        emailSent: true,
        appointmentId: appointment.appointment_id,
        sentTo: user.email,
      },
    });
  } catch (error) {
    console.error('Error in sendBookingConfirmation:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Internal server error while sending email',
      error: error.message,
    });
  }
};

const sendAppointmentFeedbackEmail = async (req, res) => {
  try {
    const { appointment_id, patient_email, patient_name, doctor_name } =
      req.body;

    if (!appointment_id || !patient_email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'appointment_id và patient_email là bắt buộc',
      });
    }

    // Tạo link chứa appointment_id
    const frontendUrl =
      process.env.FRONTEND_URL || 'https://genderhealthcare.vercel.app';
    const feedbackLink = `${frontendUrl}/feedback?appointment_id=${appointment_id}`;

    const emailData = {
      patientName: patient_name || 'Quý khách',
      doctorName: doctor_name || 'Bác sĩ',
      feedbackLink: feedbackLink,
    };

    console.log(`Sending feedback request email to: ${patient_email}`);
    const response = await emailService.sendAppointmentFeedbackEmail(
      patient_email,
      emailData
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
        sentTo: patient_email,
        feedbackLink: feedbackLink,
      },
    });
  } catch (error) {
    console.error('Error in sendAppointmentFeedbackEmail:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Lỗi server khi gửi email đánh giá cuộc hẹn',
      error: error.message,
    });
  }
};

export const emailController = {
  sendEmail,
  sendPaymentReminder,
  sendBookingConfirmation,
  sendAppointmentFeedbackEmail,
};
