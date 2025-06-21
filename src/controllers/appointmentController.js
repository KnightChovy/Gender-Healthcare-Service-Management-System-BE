import { jwtHelper } from '~/helpers/jwt';
import { appointmentServices } from '~/services/appointmentServices';
import ApiError from '~/utils/ApiError';


const createAppointment = async (req, res) => {
  try {
    // The isUser middleware has already verified the user's role.
    const appointmentData = req.body;
    console.log('appointmentData', appointmentData)
    const appointment = await appointmentServices.createAppointment(appointmentData);
    return res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment,
    });
  } catch (err) {
    const status = err instanceof ApiError ? err.statusCode : 500;
    return res.status(status).json({
      success: false,
      message: err.message || 'Failed to create appointment',
      error: err.message,
    });
  }
}

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentServices.getAllAppointments();
    return res.status(200).json({
      success: true,
      message: 'Fetched all appointments successfully',
      data: appointments,
    });
  } catch (err) {
    const status = err instanceof ApiError ? err.statusCode : 500;
    return res.status(status).json({
      success: false,
      message: err.message || 'Failed to fetch appointments',
      error: err.message,
    });
  }
}

export const appointmentController = {
  createAppointment,
  getAllAppointments,
}