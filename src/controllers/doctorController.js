import { StatusCodes } from 'http-status-codes';
import { doctorService } from '~/services/doctorService';
import { MODELS } from '~/models/initModels';

const getAllDoctors = async (req, res) => {
  try {
    const listAllDoctors = await doctorService.getAllDoctors();
    res.status(StatusCodes.OK).json({
      success: true,
      listAllDoctors,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Lỗi server khi lấy danh sách bác sĩ',
      });
    }
  }
};

/**
 * Controller cho phép bác sĩ chọn lịch làm việc
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const chooseSchedule = async (req, res) => {
  try {
    // Sử dụng req.jwtDecoded thay vì req.user
    if (!req.jwtDecoded) {
      return res.status(401).json({
        success: false,
        message: 'Không được xác thực',
      });
    }

    console.log('JWT decoded:', req.jwtDecoded); // Debug

    // Lấy user_id từ token giải mã
    // Điều chỉnh tùy theo cấu trúc của token trong dự án của bạn
    let userId;
    if (req.jwtDecoded.data) {
      userId = req.jwtDecoded.data.user_id;
    } else {
      userId = req.jwtDecoded.user_id;
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng trong token',
      });
    }

    // Lấy doctor_id từ user_id
    const doctor = await MODELS.DoctorModel.findOne({
      where: { user_id: userId },
    });

    if (!doctor) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Không tìm thấy thông tin bác sĩ cho tài khoản này',
      });
    }

    const { date, timeSlots } = req.body;

    // Validate input
    if (!date || !Array.isArray(timeSlots) || timeSlots.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Vui lòng cung cấp ngày và khung giờ làm việc',
      });
    }

    // Gọi service để tạo lịch làm việc
    const result = await doctorService.createDoctorSchedule(
      doctor.doctor_id,
      date,
      timeSlots
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Đã tạo lịch làm việc thành công',
      data: result,
    });
  } catch (error) {
    console.error('Error in chooseSchedule:', error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: error.message || 'Lỗi khi tạo lịch làm việc',
      });
  }
};

export const doctorController = {
  getAllDoctors,
  chooseSchedule,
};
