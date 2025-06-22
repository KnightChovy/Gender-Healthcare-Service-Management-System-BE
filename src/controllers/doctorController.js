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

/**
 * Controller lấy khung giờ làm việc của bác sĩ theo ngày
 */
const getAvailableTimeslots = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    // Không bắt buộc tham số date nữa

    console.log(
      `API nhận request lấy lịch làm việc của bác sĩ ${doctor_id}`
    );

    // Lấy userId từ token
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

export const doctorController = {
  getAllDoctors,
  getAvailableTimeslots,
  chooseSchedule,
};
