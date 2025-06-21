import ApiError from '~/utils/ApiError';
import { MODELS } from '~/models/initModels';

const isDoctor = async (req, res, next) => {
  try {
    if (!req.jwtDecoded) {
      throw new ApiError(401, 'Not authenticated. Token is missing or invalid.');
    }

    const { user_id, role } = req.jwtDecoded.data;

    if (role !== 'doctor') {
      throw new ApiError(403, 'Forbidden: You do not have permission. Access is restricted to doctors only.');
    }

    const doctor = await MODELS.DoctorModel.findOne({
      where: { user_id: user_id },
    });

    if (!doctor) {
      throw new ApiError(404, 'Doctor profile not found for this user.');
    }

    // Attach doctor profile to the request for later use
    req.doctor = doctor;
    next();
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    return res.status(status).json({
      success: false,
      message: error.message || 'An error occurred during authorization.',
    });
  }
};

export default isDoctor; 