import { jwtHelper } from '~/helpers/jwt';
import { appointmentServices } from '~/services/appointmentServices';
import { appointmentValidation } from '~/validations/appointmentValidation';
import ApiError from '~/utils/ApiError';


const createAppointment = async (req, res) => {
  try {
    // Validate and transform the frontend data
    const validatedData = appointmentValidation.validateAndTransformAppointmentData(req.body);
    
    const appointment = await appointmentServices.createAppointment(validatedData);
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

const getUserAppointments = async (req, res) => {
  try {
    const userId = req.jwtDecoded.data.user_id;

    if (!userId) {
      throw new ApiError(400, 'User ID is required');
    }

    const appointments = await appointmentServices.getAppointmentsByUserId(userId);
    return res.status(200).json({
      success: true,
      message: 'Fetched user appointments successfully',
      data: appointments,
    });
  } catch (err) {
    const status = err instanceof ApiError ? err.statusCode : 500;
    return res.status(status).json({
      success: false,
      message: err.message || 'Failed to fetch user appointments',
      error: err.message,
    });
  }
}

const getUserAppointmentsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      throw new ApiError(400, 'User slug is required');
    }

    const appointments = await appointmentServices.getAppointmentsByUserSlug(slug);
    return res.status(200).json({
      success: true,
      message: 'Fetched user appointments successfully',
      data: appointments,
    });
  } catch (err) {
    const status = err instanceof ApiError ? err.statusCode : 500;
    return res.status(status).json({
      success: false,
      message: err.message || 'Failed to fetch user appointments',
      error: err.message,
    });
  }
}

const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId || req.jwtDecoded.data.doctor_id;
    
    if (!doctorId) {
      throw new ApiError(400, 'Doctor ID is required');
    }

    const appointments = await appointmentServices.getAppointmentsByDoctorId(doctorId);
    return res.status(200).json({
      success: true,
      message: 'Fetched doctor appointments successfully',
      data: appointments,
    });
  } catch (err) {
    const status = err instanceof ApiError ? err.statusCode : 500;
    return res.status(status).json({
      success: false,
      message: err.message || 'Failed to fetch doctor appointments',
      error: err.message,
    });
  }
}

export const appointmentController = {
  createAppointment,
  getAllAppointments,
  getUserAppointments,
  getUserAppointmentsBySlug,
  getDoctorAppointments,
}