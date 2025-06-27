import { emailService } from '~/services/emailService';
import { StatusCodes } from 'http-status-codes';
import { MODELS } from '~/models/initModels';
import { Sequelize } from 'sequelize';

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

    const doctor_id = appointment.doctor_id;
    console.log('Looking for doctor with ID:', doctor_id);

    const doctor = await MODELS.DoctorModel.findByPk(doctor_id);

    console.log(
      'Doctor info:',
      doctor
        ? `ID: ${doctor.id}, Name: ${doctor.first_name} ${doctor.last_name}`
        : 'Doctor not found'
    );

    console.log('Looking for availability with avail_id:', appointment_id);
    let appointmentDate = 'Không xác định';

    const availability = await MODELS.AvailabilityModel.findOne({
      where: { avail_id: appointment_id.replace('AP', 'AV') },
    });

    if (availability && availability.date) {
      const dateParts = availability.date.toString().split('-');
      if (dateParts.length === 3) {
        appointmentDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      }
      console.log('Found date from availability:', appointmentDate);
    }

    const timeslot = await MODELS.TimeslotModel.findByPk(
      appointment.timeslot_id
    );

    let appointmentTime = 'Không xác định';
    if (timeslot && timeslot.time_start && timeslot.time_end) {
      const startTime = timeslot.time_start.substring(0, 5) || '';
      const endTime = timeslot.time_end.substring(0, 5) || '';
      if (startTime && endTime) {
        appointmentTime = `${startTime} - ${endTime}`;
      }
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const feedbackLink = `${frontendUrl}/feedback/appointment/${appointment_id}`;

    const emailData = {
      patientName: `${user.last_name} ${user.first_name || ''}`.trim(),
      doctorName:
        doctor && doctor.first_name
          ? `Bác sĩ ${doctor.last_name} ${doctor.first_name || ''}`.trim()
          : 'Bác sĩ tư vấn',
      feedbackLink: feedbackLink,
      appointmentId: appointment_id,
      appointmentType: appointment.consultant_type || 'Tư vấn chung',
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
      appointmentFee: appointment.price_apm
        ? `${parseFloat(appointment.price_apm).toLocaleString('vi-VN')} VND`
        : '350.000 VND',
    };

    console.log(`Sending feedback request email to: ${user.email}`);
    console.log('Email data:', emailData);

    const response = await emailService.sendAppointmentFeedbackEmail(
      user.email,
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
        sentTo: user.email,
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
