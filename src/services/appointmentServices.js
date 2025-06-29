import { MODELS } from '~/models/initModels';
import { generateAppointmentId } from '~/utils/algorithms';
import ApiError from '~/utils/ApiError';

const createAppointment = async (data) => {
  try {
    const { appointment } = data;
    const mainAppointmentData = { ...appointment };
    const { timeslot_id, appointment_time } = mainAppointmentData;
    console.log('timeslot_id', timeslot_id, appointment_time);
    if (timeslot_id && appointment_time) {
      const isDuplicateAppoinment = await MODELS.AppointmentModel.findOne({
        where: {
          appointment_time: appointment_time,
          timeslot_id: timeslot_id,
        },
      });
      if (isDuplicateAppoinment) {
        console.error(
          'Error creating appointment: appointment_time already exists for this timeslot. Conflicting appointment:'
        );
        throw new Error(
          'Failed to create appointment: The selected timeslot and time are already booked. Please choose a different time.'
        );
      }
    }

    const now = new Date();
    mainAppointmentData.created_at = now;
    mainAppointmentData.updated_at = now;

    if (!mainAppointmentData.appointment_id) {
      const latestAppointment = await MODELS.AppointmentModel.findOne({
        attributes: ['appointment_id'],
        order: [['appointment_id', 'DESC']],
      });
      const latestId = latestAppointment
        ? latestAppointment.appointment_id
        : null;
      mainAppointmentData.appointment_id = generateAppointmentId(latestId);
    }

    const result = await MODELS.AppointmentModel.sequelize.transaction(
      async (t) => {
        const createdAppointment = await MODELS.AppointmentModel.create(
          mainAppointmentData,
          { transaction: t }
        );
        return createdAppointment;
      }
    );
    return result;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw new Error('Failed to create appointment: ' + error.message);
  }
};

export const getAllAppointments = async () => {
  try {
    const appointments = await MODELS.AppointmentModel.findAll({
      include: [
        {
          model: MODELS.UserModel,
          as: 'appointments_user',
          attributes: ['user_id', 'username', 'first_name', 'last_name'],
        },
        {
          model: MODELS.DoctorModel,
          as: 'doctor',
          attributes: ['doctor_id', 'first_name', 'last_name'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    const result = appointments.map((app) => {
      const plain = app.get({ plain: true });
      return {
        ...plain,
        username: plain.appointments_user
          ? `${plain.first_name} + ${plain.last_name}`.trim()
          : '',
        doctor_name: plain.doctor
          ? `${plain.doctor.first_name || ''} ${
              plain.doctor.last_name || ''
            }`.trim()
          : '',
      };
    });
    return result;
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    throw new Error('Failed to fetch all appointments: ' + error.message);
  }
};

export const getAppointmentsByUserId = async (userId) => {
  try {
    const appointments = await MODELS.AppointmentModel.findAll({
      where: { user_id: userId },
      include: [
        {
          model: MODELS.DoctorModel,
          as: 'doctor',
          attributes: ['doctor_id', 'first_name', 'last_name'],
        },
        {
          model: MODELS.TimeslotModel,
          as: 'timeslot',
          attributes: ['timeslot_id', 'time_start', 'time_end', 'avail_id'],
          include: [
            {
              model: MODELS.AvailabilityModel,
              as: 'availability',
              attributes: ['date'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    const result = appointments.map((app) => {
      const plain = app.get({ plain: true });
      const { doctor, timeslot } = plain;
      console.log('plain', plain);
      console.log('avai', availability);
      const { availability } = plain.timeslot;

      const date = availability ? availability.date : null;
      if (plain.doctor) {
        delete plain.doctor;
      }
      if (plain.timeslot) {
        delete plain.timeslot;
      }
      return {
        ...plain,
        doctor_name: doctor
          ? `${doctor.first_name || ''} ${doctor.last_name || ''}`.trim()
          : '',
        appointment_date: date,
      };
    });

    return result;
  } catch (error) {
    console.error('Error fetching appointments by user ID:', error);
    throw new Error(
      'Failed to fetch appointments by user ID: ' + error.message
    );
  }
};

export const getAppointmentsByUserSlug = async (slug) => {
  try {
    // First find the user by slug
    const user = await MODELS.UserModel.findOne({ where: { slug } });

    if (!user) {
      throw new Error('User not found with the provided slug');
    }

    // Then get appointments for that user
    const appointments = await MODELS.AppointmentModel.findAll({
      where: { user_id: user.user_id },
      include: [
        {
          model: MODELS.DoctorModel,
          as: 'doctor',
          attributes: ['doctor_id', 'name', 'specialization', 'email', 'phone'],
        },
        {
          model: MODELS.TimeslotModel,
          as: 'timeslot',
          attributes: ['timeslot_id', 'start_time', 'end_time', 'date'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
    return appointments;
  } catch (error) {
    console.error('Error fetching appointments by user slug:', error);
    throw new Error(
      'Failed to fetch appointments by user slug: ' + error.message
    );
  }
};

export const getAppointmentsByDoctorId = async (doctorId) => {
  try {
    const appointments = await MODELS.AppointmentModel.findAll({
      where: { doctor_id: doctorId },
      include: [
        {
          model: MODELS.UserModel,
          as: 'appointments_user',
          attributes: [
            'user_id',
            'first_name',
            'last_name',
            'email',
            'phone',
            'avatar',
          ],
        },
        {
          model: MODELS.TimeslotModel,
          as: 'timeslot',
          attributes: ['timeslot_id', 'time_start', 'time_end'],
          include: [
            {
              model: MODELS.AvailabilityModel,
              as: 'availability',
              attributes: ['date'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });
    const result = appointments.map((app) => {
      const plain = app.get({ plain: true });
      const { first_name, email, phone } = plain.appointments_user;
      if (plain.appointments_user) {
        delete plain.appointments_user;
      }
      const { time_start, time_end, availability } = plain.timeslot;
      if (plain.timeslot) {
        delete plain.timeslot;
      }
      const date = availability.date;

      return {
        ...plain,
        first_name,
        email,
        phone,
        time_end,
        time_start,
        date,
      };
    });
    return result;
  } catch (error) {
    console.error('Error fetching appointments by doctor ID:', error);
    throw new Error(
      'Failed to fetch appointments by doctor ID: ' + error.message
    );
  }
};

export const updateAppointmentStatus = async (
  appointmentId,
  status,
  managerId
) => {
  try {
    // Find the appointment first
    const appointment = await MODELS.AppointmentModel.findOne({
      where: { appointment_id: appointmentId },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    const validStatuses = [
      'pending',
      'confirmed',
      'completed',
      'cancelled',
      'rejected',
    ];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status value');
    }

    await MODELS.AppointmentModel.update(
      {
        status: status,
        booking: 0,
        updated_at: new Date(),
      },
      {
        where: { appointment_id: appointmentId },
        returning: true,
      }
    );

    const result = await MODELS.AppointmentModel.findOne({
      where: { appointment_id: appointmentId },
      include: [
        {
          model: MODELS.UserModel,
          as: 'appointments_user',
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone'],
        },
        {
          model: MODELS.DoctorModel,
          as: 'doctor',
          attributes: ['doctor_id', 'first_name', 'last_name'],
        },
      ],
    });
    return {
      appointment: result,
      action: status,
      approvedBy: managerId,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw new Error('Failed to update appointment status: ' + error.message);
  }
};

const handlePaymentAppoinment = async (appointmentID) => {
  try {
    const appoinment = MODELS.AppointmentModel.findOne({
      where: { appointment_id: appointmentID },
    });
    if (!appoinment) {
      console.error('Error find appointment:');
      throw new Error('Failed to find appointment: ');
    }
    const isSuccess = MODELS.AppointmentModel.update(
      { booking: 1 },
      { where: { appointment_id: appointmentID } }
    );
    return isSuccess;
  } catch (error) {
    console.error('Error updating appointment booking:', error);
    throw new Error('Failed to update booking: ' + error.message);
  }
};

const submitFeedback = async (appointmentId, userId, feedbackData) => {
  try {
    const appointment = await MODELS.AppointmentModel.findOne({
      where: {
        appointment_id: appointmentId,
        user_id: userId,
      },
    });

    if (!appointment) {
      throw new ApiError(
        404,
        'Không tìm thấy cuộc hẹn hoặc bạn không có quyền đánh giá'
      );
    }

    if (appointment.status !== 'completed') {
      throw new ApiError(400, 'Chỉ có thể đánh giá cuộc hẹn đã hoàn thành');
    }

    appointment.rating = parseFloat(feedbackData.rating.toFixed(1));
    appointment.feedback = feedbackData.feedback || '';

    await appointment.save();

    return {
      appointment_id: appointment.appointment_id,
      rating: appointment.rating,
      feedback: appointment.feedback,
    };
  } catch (error) {
    console.error('Error in submitFeedback service:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Lỗi khi cập nhật đánh giá: ${error.message}`);
  }
};

export const appointmentServices = {
  createAppointment,
  getAllAppointments,
  getAppointmentsByUserId,
  getAppointmentsByUserSlug,
  getAppointmentsByDoctorId,
  updateAppointmentStatus,
  handlePaymentAppoinment,
  submitFeedback,
};
