import { MODELS } from '~/models/initModels';

const getAllServices = async () => {
  try {
    const services = await MODELS.ServiceTestModel.findAll();
    console.log('services', services)
    return services;
  } catch (error) {
    throw new Error('Failed to get all services: ' + error.message);
  }
};

const bookingService = async (dataBooking) => {
  try {
    const appointment = MODELS.AppointmentModel.findOne({
      where: {
        appointment_id: dataBooking.appointment_id,
        user_id: dataBooking.user_id
      }
    })
    if (!appointment) {
      console.log('error when booking service')
      throw new Error('Failed to booking services: ');
    }

    if (!appointment.status === 'completed') {
      console.log('error when booking service')
      throw new Error('Failed to booking services: ');
    }

    const now = new Date();


  } catch (error) {
    throw new Error('Failed to booking services: ' + error.message);
  }
}
export const serviceService = {
  getAllServices,
  bookingService
}; 