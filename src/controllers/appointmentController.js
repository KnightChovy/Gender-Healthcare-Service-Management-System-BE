import { jwtHelper } from '~/helpers/jwt';
import { appointmentServices } from '~/services/appointmentServices';
import { appointmentValidation } from '~/validations/appointmentValidation';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';

const createAppointment = async (req, res, next) => {
  try {
    const validatedData =
      appointmentValidation.validateAndTransformAppointmentData(req.body);
    const result = await appointmentServices.createAppointment(validatedData);
    return res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: result,
    });
  } catch (err) {
    next(err)
  }
};

const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentServices.getAllAppointments();
    console.log('appointments ne', appointments);
    return res.status(200).json({
      success: true,
      message: 'Fetched all appointments successfully',
      data: appointments,
    });
  } catch (err) {
    next(err)
  }
};

const getUserAppointments = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded.data.user_id;

    if (!userId) {
      throw new ApiError(400, 'User ID is required');
    }

    const appointments = await appointmentServices.getAppointmentsByUserId(
      userId
    );
    return res.status(200).json({
      success: true,
      message: 'Fetched user appointments successfully',
      data: appointments,
    });
  } catch (err) {
    next(err)
  }
};

const getUserAppointmentsBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      throw new ApiError(400, 'User slug is required');
    }

    const appointments = await appointmentServices.getAppointmentsByUserSlug(
      slug
    );
    return res.status(200).json({
      success: true,
      message: 'Fetched user appointments successfully',
      data: appointments,
    });
  } catch (err) {
    next(err)
  }
}
const getDoctorAppointments = async (req, res, next) => {
  try {
    const doctorId =
      req.params.doctorId ||
      req.jwtDecoded.data.doctor_id ||
      req.doctor.doctor_id;
    if (!doctorId) {
      throw new ApiError(400, 'Doctor ID is required');
    }
    console.log('doctorId', doctorId);

    const appointments = await appointmentServices.getAppointmentsByDoctorId(
      doctorId
    );
    return res.status(200).json({
      success: true,
      message: 'Fetched doctor appointments successfully',
      data: appointments,
    });
  } catch (err) {
    next(err)
  }
}
const approveAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;
    const managerId = req.jwtDecoded.data.user_id;
    console.log('appointmentId', 'status', appointmentId, status);
    if (!appointmentId) {
      throw new ApiError(400, 'Appointment ID is required');
    }

    if (!status) {
      throw new ApiError(400, 'Status is required');
    }

    const result = await appointmentServices.updateAppointmentStatus(
      appointmentId,
      status,
      managerId
    );

    return res.status(200).json({
      success: true,
      message: `Appointment ${status} successfully`,
      data: result,
    });
  } catch (err) {
    next(err)
  }
};

const ApproveAppointments = async (req, res, next) => {
  try {
    const { appointmentIds, status } = req.body;
    const managerId = req.jwtDecoded.data.user_id;

    if (!appointmentIds) {
      throw new ApiError(400, 'Appointment ID(s) is required');
    }

    if (!status) {
      throw new ApiError(400, 'Status is required');
    }
    const appointmentIdArray = Array.isArray(appointmentIds)
      ? appointmentIds
      : [appointmentIds];

    if (appointmentIdArray.length === 0) {
      throw new ApiError(400, 'At least one appointment ID is required');
    }

    const results = [];
    const errors = [];

    for (const appointmentId of appointmentIdArray) {
      try {
        const result = await appointmentServices.updateAppointmentStatus(
          appointmentId,
          status,
          managerId
        );
        results.push(result);
      } catch (error) {
        errors.push({ appointmentId, error: error.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: `${status} completed`,
      data: {
        successful: results,
        failed: errors,
      },
    });
  } catch (err) {
    next(err)
  }
};

const submitFeedback = async (req, res, next) => {
  try {
    const { appointment_id } = req.params;
    const { rating, feedback } = req.body;
    const userId = req.jwtDecoded.data?.user_id;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated properly');
    }

    if (!appointment_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'ID cuộc hẹn không hợp lệ',
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Đánh giá phải từ 1 đến 5 sao',
      });
    }

    const result = await appointmentServices.submitFeedback(
      appointment_id,
      userId,
      { rating, feedback }
    );

    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Gửi đánh giá thành công',
      data: result,
    });
  } catch (error) {
    next(error)
  }
};
const doctorCompleteAppointment = async (req, res, next) => {
  try {
    const data = req.body
    const { appointment_id } = data
    const doctor_id = req.params
    console.log('app_id', appointment_id)
    const completedAppointment = appointmentServices.doctorCompleteAppointment(appointment_id, doctor_id)
    return res.status(200).json({
      message: 'Cập nhật trạng thái cuộc hẹn thành công',
      appointment: completedAppointment,
    });
  } catch (error) {
    next(error)
  }
}
export const appointmentController = {
  createAppointment,
  getAllAppointments,
  getUserAppointments,
  getUserAppointmentsBySlug,
  getDoctorAppointments,
  approveAppointment,
  ApproveAppointments,
  submitFeedback,
  doctorCompleteAppointment
};
