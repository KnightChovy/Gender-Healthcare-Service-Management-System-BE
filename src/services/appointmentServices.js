import { appointmentModel } from '~/models/appointmentModel';
import { MODELS } from '~/models/initModels';
import { generateAppointmentId } from '~/utils/algorithms';

const createAppointment = async (data) => {
  try {
    const { appointment } = data;
    const mainAppointmentData = { ...appointment };

    // Set timestamps
    const now = new Date();
    mainAppointmentData.created_at = now;
    mainAppointmentData.updated_at = now;

    if (!mainAppointmentData.appointment_id) {
      const latestAppointment = await MODELS.AppointmentModel.findOne({
        attributes: ['appointment_id'],
        order: [['appointment_id', 'DESC']],
      });
      const latestId = latestAppointment ? latestAppointment.appointment_id : null;
      mainAppointmentData.appointment_id = generateAppointmentId(latestId);
    }

    const result = await MODELS.AppointmentModel.sequelize.transaction(async (t) => {
      const createdAppointment = await MODELS.AppointmentModel.create(mainAppointmentData, { transaction: t });
      return createdAppointment;
    });
    return result;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw new Error('Failed to create appointment: ' + error.message);
  }
}

export const getAllAppointments = async () => {
  try {
    const appointments = await MODELS.AppointmentModel.findAll();
    return appointments;
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    throw new Error('Failed to fetch all appointments: ' + error.message);
  }
}

export const getAppointmentsByUserId = async (userId) => {
  try {
    const appointments = await MODELS.AppointmentModel.findAll({
      where: { user_id: userId },
      include: [
        {
          model: MODELS.DoctorModel,
          as: 'doctor',
          attributes: ['doctor_id', 'name', 'specialization', 'email', 'phone']
        },
        {
          model: MODELS.TimeSlotModel,
          as: 'timeslot',
          attributes: ['timeslot_id', 'start_time', 'end_time', 'date']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    return appointments;
  } catch (error) {
    console.error('Error fetching appointments by user ID:', error);
    throw new Error('Failed to fetch appointments by user ID: ' + error.message);
  }
}

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
          attributes: ['doctor_id', 'name', 'specialization', 'email', 'phone']
        },
        {
          model: MODELS.TimeSlotModel,
          as: 'timeslot',
          attributes: ['timeslot_id', 'start_time', 'end_time', 'date']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    return appointments;
  } catch (error) {
    console.error('Error fetching appointments by user slug:', error);
    throw new Error('Failed to fetch appointments by user slug: ' + error.message);
  }
}

export const getAppointmentsByDoctorId = async (doctorId) => {
  try {
    const appointments = await MODELS.AppointmentModel.findAll({
      where: { doctor_id: doctorId },
      include: [
        {
          model: MODELS.UserModel,
          as: 'appointments_user',
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone', 'avatar']
        },
        {
          model: MODELS.TimeSlotModel,
          as: 'timeslot',
          attributes: ['timeslot_id', 'start_time', 'end_time', 'date']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    return appointments;
  } catch (error) {
    console.error('Error fetching appointments by doctor ID:', error);
    throw new Error('Failed to fetch appointments by doctor ID: ' + error.message);
  }
}

export const appointmentServices = {
  createAppointment,
  getAllAppointments,
  getAppointmentsByUserId,
  getAppointmentsByUserSlug,
  getAppointmentsByDoctorId,
}