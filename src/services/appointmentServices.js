import { appointmentModel } from '~/models/appointmentModel';
import { MODELS } from '~/models/initModels';
import { generateAppointmentId } from '~/utils/algorithms';

const createAppointment = async (data) => {
  try {
    const { appointment, detailAppointment_tests } = data;
    const mainAppointmentData = { ...appointment };
    if (!mainAppointmentData.appointment_id) {
      const latestAppointment = await MODELS.AppointmentModel.findOne({
        order: [['appointment_id', 'DESC']],
      });
      const latestId = latestAppointment ? latestAppointment.appointment_id : null;
      mainAppointmentData.appointment_id = generateAppointmentId(latestId);
    }

    const result = await MODELS.AppointmentModel.sequelize.transaction(async (t) => {
      const createdAppointment = await MODELS.AppointmentModel.create(mainAppointmentData, { transaction: t });

      if (Array.isArray(detailAppointment_tests) && detailAppointment_tests.length > 0) {
        const latestDetail = await MODELS.DetailAppointmentTestModel.findOne({
          order: [['appointmentTest_id', 'DESC']],
          transaction: t,
        });
        let nextDetailId = 1;
        if (latestDetail) {
          const latestDetailNum = parseInt(latestDetail.appointmentTest_id.substring(2));
          if (!isNaN(latestDetailNum)) nextDetailId = latestDetailNum + 1;
        }
        for (const test of detailAppointment_tests) {
          await MODELS.DetailAppointmentTestModel.create({
            appointmentTest_id: `DT${nextDetailId.toString().padStart(6, '0')}`,
            appointment_id: mainAppointmentData.appointment_id,
            service_id: test.service_id,
            name: test.name,
            price: test.price,
          }, { transaction: t });
          nextDetailId++;
        }
      }
      return createdAppointment;
    });
    return result;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw new Error('Failed to create appointment: ' + error.message);
  }
}

export const appointmentServices = {
  createAppointment,
}