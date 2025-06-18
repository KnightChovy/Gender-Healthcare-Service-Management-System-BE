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

const chooseSchedule = async (req, res) => {
  try {
    if (!req.jwtDecoded) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Không được xác thực',
      });
    }

    const userId = req.jwtDecoded.data?.user_id;

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng trong token',
      });
    }

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

    if (!date || !Array.isArray(timeSlots) || timeSlots.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Vui lòng cung cấp ngày và khung giờ làm việc',
      });
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
