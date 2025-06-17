import { appointmentModel } from '~/models/appointmentModel';
import { MODELS } from '~/models/initModels';

const createAppointment = async (appointmentData) => {
  try {
    if (!appointmentData.appointment_id) {
      const latestAppointment = await MODELS.AppointmentModel.findOne({
        order: [['appointment_id', 'DESC']],
      });
      let nextId = 1;
      console.log('latestAppointment', latestAppointment)
      if (latestAppointment) {
        const latestId = parseInt(latestAppointment.appointment_id.substring(2));
        nextId = latestId + 1;
      }
      appointmentData.appointment_id = `AP${nextId.toString().padStart(6, '0')}`

    }
    const appointment = await appointmentModel.createAppointment(appointmentData);
    return appointment;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw new Error('Failed to create appointment: ' + error.message);
  }
}



export const appointmentServices = {
  createAppointment,
}