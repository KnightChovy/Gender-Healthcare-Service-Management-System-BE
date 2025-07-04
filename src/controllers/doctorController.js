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

const chooseSchedule = async (req, res) => {
  try {
    const doctor = req.doctor;

    const { date, timeSlots } = req.body;

    if (!date || !Array.isArray(timeSlots) || timeSlots.length === 0) {
      throw new ApiError(400, 'Vui lòng cung cấp ngày và khung giờ làm việc');
    }

    const result = await doctorService.createDoctorSchedule(
      doctor.doctor_id,
      date,
      timeSlots
    );

    console.log(
      `[SUCCESS] Bác sĩ ${doctor.doctor_id} đã đăng ký thành công lịch làm việc cho ngày ${date}`
    );
    console.log(
      `[SUCCESS] Đã tạo ${result.timeSlots.length} khung giờ làm việc`
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Đã tạo lịch làm việc thành công',
      data: result,
    });
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    return res.status(status).json({
      success: false,
      message: error.message || 'Lỗi khi tạo lịch làm việc',
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
