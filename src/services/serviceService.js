import { MODELS } from '~/models/initModels';

const getAllServices = async () => {
  try {
    const services = await MODELS.ServiceTestModel.findAll();
    return services;
  } catch (error) {
    throw new Error('Failed to get all services: ' + error.message);
  }
};

const bookingService = async (dataBooking) => {
  try {
    const { ...mainData } = dataBooking
    console.log('mainData',mainData)
    const appointment = await MODELS.AppointmentModel.findOne({
      where: {
        appointment_id: mainData.appointment_id,
        user_id: mainData.user_id
      }
    })

    const { services } = mainData

    if (!appointment) {
      console.log('error when booking service')
      throw new Error('Failed to booking services: ');
    }

    if (!appointment.status === 'completed') {
      console.log('error when booking service')
      throw new Error('Failed to booking services: ');
    }

    const latestDetailAppointment = await MODELS.DetailAppointmentTestModel.findOne({
      attributes: ['appointmentTest_id'],
      order: [['appointmentTest_id', 'DESC']],
    })

    let baseId = 1;
    if (latestDetailAppointment && latestDetailAppointment.appointmentTest_id) {
      const lastIdNum = parseInt(latestDetailAppointment.appointmentTest_id.replace('DT', ''), 10);
      baseId = lastIdNum + 1;
    }

    const now = new Date()
    const createPromises = services.map((service, index) => {
      const appointmentTestId = 'DT' + String(baseId + index).padStart(6, '0');

      const createData = {
        appointmentTest_id: appointmentTestId,
        appointment_id: mainData.appointment_id,
        service_id: service.service_id,
        name: service.name,
        price: service.price,
        created_at: now,
        updated_at: now
      };

      return MODELS.DetailAppointmentTestModel.create(createData);
    });
    await Promise.all(createPromises);
    return {
      message: 'Tạo dịch vụ xét nghiệm thành công',
      total_services: services.length
    };

  } catch (error) {
    throw new Error('Failed to booking services: ' + error.message);
  }
}
export const serviceService = {
  getAllServices,
  bookingService
}; 