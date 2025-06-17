import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';
import { MODELS } from '~/models/initModels';
import { doctorModel } from '~/models/doctorModel';
import { ApiError } from '~/utils/ApiError';

const getAllDoctors = async () => {
  try {
    const listAllDoctors = await doctorModel.findAllDoctors();

    const formattedDoctors = listAllDoctors.map((doctor) => {
      const plainDoctor = doctor.get({ plain: true });

      if (plainDoctor.user) {
        delete plainDoctor.user_id;
        Object.assign(plainDoctor, plainDoctor.user);
        delete plainDoctor.user;
      }

      return plainDoctor;
    });

    return formattedDoctors;
  } catch (error) {
    console.error('Error in doctorService.getAllDoctors:', error);
    throw {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Lỗi khi lấy danh sách bác sĩ',
    };
  }
};

/**
 * Tạo lịch làm việc cho bác sĩ (một ngày với nhiều khung giờ)
 * @param {string} doctorId - ID của bác sĩ
 * @param {string} date - Ngày làm việc (YYYY-MM-DD)
 * @param {Array} timeSlots - Danh sách các khung giờ [{time_start, time_end}]
 * @returns {Object} - Thông tin lịch làm việc đã tạo
 */
const createDoctorSchedule = async (doctorId, date, timeSlots) => {
  try {
    // Kiểm tra bác sĩ tồn tại
    const doctor = await MODELS.DoctorModel.findByPk(doctorId);
    if (!doctor) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy thông tin bác sĩ');
    }

    // Tạo hoặc lấy availability cho ngày này
    let availability = await MODELS.AvailabilityModel.findOne({
      where: { doctor_id: doctorId, date },
    });

    if (!availability) {
      // Tạo ID mới cho availability
      const lastAvailability = await MODELS.AvailabilityModel.findOne({
        order: [['avail_id', 'DESC']],
      });

      let avail_id;
      if (!lastAvailability) {
        avail_id = 'AV000001';
      } else {
        const lastId = parseInt(lastAvailability.avail_id.substring(2));
        avail_id = `AV${String(lastId + 1).padStart(6, '0')}`;
      }

      // Tạo availability mới
      availability = await MODELS.AvailabilityModel.create({
        avail_id,
        doctor_id: doctorId,
        date,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Tạo các timeslots
    const createdTimeSlots = [];

    for (const slot of timeSlots) {
      const { time_start, time_end } = slot;

      // Kiểm tra thời gian hợp lệ
      if (time_start >= time_end) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'Giờ bắt đầu phải sớm hơn giờ kết thúc'
        );
      }

      // Kiểm tra xem khung giờ có trùng với khung giờ khác không
      const existingSlot = await MODELS.TimeslotModel.findOne({
        where: {
          avail_id: availability.avail_id,
          [Op.or]: [
            {
              time_start: { [Op.lt]: time_end },
              time_end: { [Op.gt]: time_start },
            },
          ],
        },
      });

      if (existingSlot) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          `Khung giờ ${time_start} - ${time_end} trùng với khung giờ hiện có`
        );
      }

      // Tạo ID mới cho timeslot
      const lastTimeSlot = await MODELS.TimeslotModel.findOne({
        order: [['timeslot_id', 'DESC']],
      });

      let timeslot_id;
      if (!lastTimeSlot) {
        timeslot_id = 'TS000001';
      } else {
        const lastId = parseInt(lastTimeSlot.timeslot_id.substring(2));
        timeslot_id = `TS${String(lastId + 1).padStart(6, '0')}`;
      }

      // Tạo timeslot mới
      const newTimeSlot = await MODELS.TimeslotModel.create({
        timeslot_id,
        avail_id: availability.avail_id,
        time_start,
        time_end,
        status: 'available',
      });

      createdTimeSlots.push(newTimeSlot);
    }

    // 4. Trả về kết quả
    return {
      availability: {
        avail_id: availability.avail_id,
        date: availability.date,
      },
      timeSlots: createdTimeSlots.map((slot) => ({
        timeslot_id: slot.timeslot_id,
        time_start: slot.time_start,
        time_end: slot.time_end,
        status: slot.status,
      })),
    };
  } catch (error) {
    console.error('Error in createDoctorSchedule:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Lỗi khi tạo lịch làm việc: ' + error.message
    );
  }
};

export const doctorService = {
  getAllDoctors,
  createDoctorSchedule,
};
