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

const createDoctorSchedule = async (doctorId, date, timeSlots) => {
  try {
    const doctor = await MODELS.DoctorModel.findByPk(doctorId);
    if (!doctor) {
      const error = new Error('Không tìm thấy thông tin bác sĩ');
      error.statusCode = StatusCodes.NOT_FOUND;
      throw error;
    }

    let availability = await MODELS.AvailabilityModel.findOne({
      where: { doctor_id: doctorId, date },
    });

    if (!availability) {
      const avail_id = await generateUniqueAvailabilityId();

      availability = await MODELS.AvailabilityModel.create({
        avail_id,
        doctor_id: doctorId,
        date,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    const createdTimeSlots = [];

    for (const slot of timeSlots) {
      const { time_start, time_end } = slot;

      if (time_start >= time_end) {
        const error = new Error('Giờ bắt đầu phải sớm hơn giờ kết thúc');
        error.statusCode = StatusCodes.BAD_REQUEST;
        throw error;
      }

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

      const timeslot_id = await generateUniqueTimeSlotId();

      const newTimeSlot = await MODELS.TimeslotModel.create({
        timeslot_id,
        avail_id: availability.avail_id,
        time_start,
        time_end,
        status: 'available',
      });

      createdTimeSlots.push(newTimeSlot);
    }

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

const generateUniqueTimeSlotId = async () => {
  try {
    const timeSlots = await MODELS.TimeslotModel.findAll({
      attributes: ['timeslot_id'],
      where: {
        timeslot_id: {
          [Op.like]: 'TS%',
        },
      },
    });

    let maxId = 0;

    timeSlots.forEach((slot) => {
      if (slot.timeslot_id.match(/^TS\d{6}$/)) {
        const idNum = parseInt(slot.timeslot_id.substring(2), 10);
        if (idNum > maxId) {
          maxId = idNum;
        }
      }
    });

    maxId++;
    const newId = `TS${String(maxId).padStart(6, '0')}`;

    const existing = await MODELS.TimeslotModel.findOne({
      where: { timeslot_id: newId },
    });

    if (existing) {
      return generateUniqueTimeSlotId(); // Đệ quy gọi lại nếu ID đã tồn tại
    }

    return newId;
  } catch (error) {
    console.error('Error generating timeslot ID:', error);
    throw new Error('Không thể tạo ID cho khung giờ');
  }
};

const generateUniqueAvailabilityId = async () => {
  try {
    const availabilities = await MODELS.AvailabilityModel.findAll({
      attributes: ['avail_id'],
      where: {
        avail_id: {
          [Op.like]: 'AV%',
        },
      },
    });

    let maxId = 0;

    availabilities.forEach((avail) => {
      if (avail.avail_id.match(/^AV\d{6}$/)) {
        const idNum = parseInt(avail.avail_id.substring(2), 10);
        if (idNum > maxId) {
          maxId = idNum;
        }
      }
    });

    maxId++;
    const newId = `AV${String(maxId).padStart(6, '0')}`;

    const existing = await MODELS.AvailabilityModel.findOne({
      where: { avail_id: newId },
    });

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
