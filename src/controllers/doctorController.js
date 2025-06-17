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
    // Lấy thông tin user từ token (thông qua middleware isAuth)
    const userId = req.user.data?.user_id || req.user.user_id;
    const userRole = req.user.data?.role || req.user.role;

    // Kiểm tra vai trò
    if (userRole !== 'doctor') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Bạn không có quyền truy cập chức năng này',
      });
    }

    // 2. Lấy doctor_id từ user_id
    const doctor = await MODELS.DoctorModel.findOne({
      where: { user_id: userId },
    });

    if (!doctor) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Không tìm thấy thông tin bác sĩ cho tài khoản này',
      });
    }

    // 3. Lấy thông tin từ request body
    const { date, timeSlots } = req.body;

    // 4. Validate input
    if (!date) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Vui lòng cung cấp ngày làm việc',
      });
    }

    if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Vui lòng cung cấp ít nhất một khung giờ làm việc',
      });
    }

    // 5. Gọi service để xử lý nghiệp vụ
    const schedule = await doctorService.createDoctorSchedule(
      doctor.doctor_id,
      date,
      timeSlots
    );

    // 6. Trả về response
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Đã tạo lịch làm việc thành công',
      data: schedule,
    });
  } catch (error) {
    console.error('Error in chooseSchedule:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Có lỗi xảy ra khi tạo lịch làm việc';

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const doctorController = {
  getAllDoctors,
  chooseSchedule,
};
