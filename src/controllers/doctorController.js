import { StatusCodes } from 'http-status-codes';
import { doctorService } from '~/services/doctorService';
import { MODELS } from '~/models/initModels';
import ApiError from '~/utils/ApiError';

const getAllDoctors = async (req, res) => {
  try {
    const listAllDoctors = await doctorService.getAllDoctors();
    res.status(StatusCodes.OK).json({
      success: true,
      listAllDoctors,
    });
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Lỗi server khi lấy danh sách bác sĩ',
    });
  }
};

const getAvailableTimeslots = async (req, res) => {
  try {
    const { doctor_id } = req.params;

    console.log(`API nhận request lấy lịch làm việc của bác sĩ ${doctor_id}`);

    const userId = req.jwtDecoded?.data?.user_id;
    console.log(`User ${userId} đang xem lịch của bác sĩ ${doctor_id}`);

    const result = await doctorService.getAllDoctorTimeslots(doctor_id);
    console.log(`Đã lấy lịch làm việc của bác sĩ ${doctor_id}`);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    return res.status(status).json({
      success: false,
      message: error.message || 'Lỗi khi lấy lịch làm việc của bác sĩ',
    });
  }
};

export const chooseSchedule = async (req, res) => {
  try {
    const { weekStartDate, schedule } = req.body;
    const userId = req.jwtDecoded.data.user_id;

    const doctor = await MODELS.DoctorModel.findOne({
      where: { user_id: userId },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin bác sĩ',
      });
    }

    const result = await doctorService.createWeeklySchedule(
      doctor.doctor_id,
      weekStartDate,
      schedule
    );

    return res.status(200).json({
      success: true,
      message: 'Cập nhật lịch làm việc thành công',
      data: result,
    });
  } catch (error) {
    console.error('Error in chooseSchedule:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật lịch làm việc',
    });
  }
};

const getDoctorByID = async (req, res) => {
  try {
    const doctor = req.doctor;
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: 'Không tìm thấy bác sĩ' });
    }
    const result = await doctorService.getDoctorByID(doctor);
    console.log('result', result);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Lấy thông tin bác sĩ thành công',
      data: result,
    });
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    return res.status(status).json({
      success: false,
      message: error.message || 'Lỗi khi lấy bác sĩ',
    });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.params.doctor_id;
    const userId = req.jwtDecoded?.data?.user_id;
    const userRole = req.jwtDecoded?.data?.role;
    const doctorData = req.body;

    if (!req.jwtDecoded || !req.jwtDecoded.data) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng từ token',
      });
    }

    const updatedDoctor = await doctorService.updateDoctorProfile(
      doctorId,
      doctorData,
      userId,
      userRole
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Cập nhật thông tin bác sĩ thành công',
      data: updatedDoctor,
    });
  } catch (error) {
    console.error('Error updating doctor profile:', error);

    if (error.message === 'Unauthorized') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền cập nhật hồ sơ này',
      });
    }

    const statusCode =
      error instanceof ApiError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật thông tin bác sĩ',
    });
  }
};

export const doctorController = {
  getAllDoctors,
  getAvailableTimeslots,
  chooseSchedule,
  getDoctorByID,
  updateDoctorProfile,
};
