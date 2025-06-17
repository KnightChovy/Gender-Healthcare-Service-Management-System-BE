import { appointmentServices } from '~/services/appointmentServices';


const createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;
    console.log('appointmentData', appointmentData)
    const appointment = await appointmentServices.createAppointment(appointmentData);
    return res.status(200).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: err.message,
    });
  }
}
export const appointmentController = {
  createAppointment,
}