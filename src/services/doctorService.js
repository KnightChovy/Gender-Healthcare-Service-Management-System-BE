import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';
import { MODELS } from '~/models/initModels';
import { doctorModel } from '~/models/doctorModel';

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
 * Tạo lịch làm việc cho bác sĩ
 * @param {string} doctorId - ID của bác sĩ
 * @param {string} date - Ngày làm việc (YYYY-MM-DD)
 * @param {Array} timeSlots - Danh sách các khung giờ [{time_start, time_end}]
 * @returns {Object} - Thông tin lịch làm việc đã tạo
 */
const createDoctorSchedule = async (doctorId, date, timeSlots) => {
  try {
    // 1. Kiểm tra bác sĩ tồn tại
    const doctor = await MODELS.DoctorModel.findByPk(doctorId);
    if (!doctor) {
      const error = new Error('Không tìm thấy thông tin bác sĩ');
      error.statusCode = StatusCodes.NOT_FOUND;
      throw error;
    }

    // 2. Tạo hoặc lấy availability cho ngày này
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

    // 3. Tạo các timeslots
    const createdTimeSlots = [];

    for (const slot of timeSlots) {
      const { time_start, time_end } = slot;

      // Kiểm tra thời gian hợp lệ
      if (time_start >= time_end) {
        const error = new Error('Giờ bắt đầu phải sớm hơn giờ kết thúc');
        error.statusCode = StatusCodes.BAD_REQUEST;
        throw error;
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
        const error = new Error(
          `Khung giờ ${time_start} - ${time_end} trùng với khung giờ hiện có`
        );
        error.statusCode = StatusCodes.CONFLICT;
        throw error;
      }

      // Tạo ID duy nhất cho timeslot
      const timeslot_id = await generateUniqueTimeSlotId();

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
    // Đảm bảo lỗi luôn có statusCode
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
    throw error;
  }
};

/**
 * Tạo ID duy nhất cho timeslot
 * @returns {string} ID duy nhất cho timeslot
 */
const generateUniqueTimeSlotId = async () => {
  try {
    // Tìm timeslot có ID lớn nhất
    const lastTimeSlot = await MODELS.TimeslotModel.findOne({
      order: [['timeslot_id', 'DESC']],
    });

    let lastId;
    if (!lastTimeSlot) {
      lastId = 0;
    } else {
      // Lấy số từ ID cuối
      const matches = lastTimeSlot.timeslot_id.match(/\d+$/);
      lastId = matches ? parseInt(matches[0]) : 0;
    }

    // Tăng ID thêm một đơn vị
    lastId++;

    // Tạo ID mới
    const newId = `TS${String(lastId).padStart(6, '0')}`;

    // Kiểm tra xem ID này đã tồn tại chưa
    const existing = await MODELS.TimeslotModel.findOne({
      where: { timeslot_id: newId },
    });

    // Nếu đã tồn tại, dùng timestamp để đảm bảo duy nhất
    if (existing) {
      const timestamp = Date.now().toString().slice(-6);
      return `TS${timestamp}`;
    }

    return newId;
  } catch (error) {
    console.error('Error generating timeslot ID:', error);
    throw new Error('Không thể tạo ID cho khung giờ');
  }
};

export const doctorService = {
  getAllDoctors,
  createDoctorSchedule,
};
