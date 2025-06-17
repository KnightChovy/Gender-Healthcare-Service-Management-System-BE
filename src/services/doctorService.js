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
      const avail_id = await generateUniqueAvailabilityId();

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
 * Tạo ID duy nhất cho timeslot theo định dạng TS000001
 * @returns {string} ID duy nhất cho timeslot
 */
const generateUniqueTimeSlotId = async () => {
  try {
    // Tìm timeslot có ID lớn nhất đúng định dạng TSxxxxxx
    const timeSlots = await MODELS.TimeslotModel.findAll({
      attributes: ['timeslot_id'],
      where: {
        timeslot_id: {
          [Op.like]: 'TS%',
        },
      },
    });

    let maxId = 0;

    // Tìm ID số lớn nhất trong các ID đúng định dạng
    timeSlots.forEach((slot) => {
      if (slot.timeslot_id.match(/^TS\d{6}$/)) {
        const idNum = parseInt(slot.timeslot_id.substring(2), 10);
        if (idNum > maxId) {
          maxId = idNum;
        }
      }
    });

    // Tạo ID mới với định dạng TS + 6 chữ số
    maxId++;
    const newId = `TS${String(maxId).padStart(6, '0')}`;

    // Kiểm tra xem ID này đã tồn tại chưa (để đảm bảo duy nhất)
    const existing = await MODELS.TimeslotModel.findOne({
      where: { timeslot_id: newId },
    });

    // Nếu đã tồn tại, tăng ID lên 1 và thử lại
    if (existing) {
      return generateUniqueTimeSlotId(); // Đệ quy gọi lại nếu ID đã tồn tại
    }

    return newId;
  } catch (error) {
    console.error('Error generating timeslot ID:', error);
    throw new Error('Không thể tạo ID cho khung giờ');
  }
};

/**
 * Tạo ID duy nhất cho availability theo định dạng AV000001
 * @returns {string} ID duy nhất cho availability
 */
const generateUniqueAvailabilityId = async () => {
  try {
    // Lấy tất cả các ID để tìm ID lớn nhất đúng định dạng
    const availabilities = await MODELS.AvailabilityModel.findAll({
      attributes: ['avail_id'],
      where: {
        avail_id: {
          [Op.like]: 'AV%',
        },
      },
    });

    let maxId = 0;

    // Tìm ID số lớn nhất trong các ID đúng định dạng
    availabilities.forEach((avail) => {
      if (avail.avail_id.match(/^AV\d{6}$/)) {
        const idNum = parseInt(avail.avail_id.substring(2), 10);
        if (idNum > maxId) {
          maxId = idNum;
        }
      }
    });

    // Tạo ID mới với định dạng AV + 6 chữ số
    maxId++;
    const newId = `AV${String(maxId).padStart(6, '0')}`;

    // Kiểm tra xem ID này đã tồn tại chưa
    const existing = await MODELS.AvailabilityModel.findOne({
      where: { avail_id: newId },
    });

    // Nếu đã tồn tại, tăng ID lên 1 và thử lại
    if (existing) {
      return generateUniqueAvailabilityId(); // Đệ quy gọi lại nếu ID đã tồn tại
    }

    return newId;
  } catch (error) {
    console.error('Error generating availability ID:', error);
    throw new Error('Không thể tạo ID cho ngày làm việc');
  }
};

export const doctorService = {
  getAllDoctors,
  createDoctorSchedule,
  generateUniqueTimeSlotId,
  generateUniqueAvailabilityId,
};
