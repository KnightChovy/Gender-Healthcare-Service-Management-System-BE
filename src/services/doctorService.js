import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';
import { MODELS } from '~/models/initModels';
import { doctorModel } from '~/models/doctorModel';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { env } from '~/config/environment';
import { GET_DB } from '~/config/mysql';
dotenv.config();

const getAllDoctors = async () => {
  try {
    const doctors = await MODELS.DoctorModel.findAll({
      include: [
        {
          model: MODELS.UserModel,
          as: 'user',
          attributes: [
            'first_name',
            'last_name',
            'email',
            'avatar',
            'gender',
            'phone',
          ],
          where: {
            status: { [Op.ne]: 0 }, // Chỉ lấy bác sĩ có user status khác 0
          },
        },
        {
          model: MODELS.CertificateModel,
          as: 'certificates',
          attributes: ['certificate', 'specialization'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return doctors;
  } catch (error) {
    console.error('Error getting all doctors:', error);
    throw new Error('Lỗi khi lấy danh sách bác sĩ');
  }
};

const createDoctorSchedule = async (doctorId, date, timeSlots) => {
  try {
    const doctor = await doctorModel.findByPkDoctor(doctorId);
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
      console.log(`[INFO] Tạo availability mới với ID ${avail_id}`);
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

      console.log(
        `[SUCCESS] Đã tạo khung giờ ${timeslot_id}: ${time_start} - ${time_end}`
      );
      createdTimeSlots.push(newTimeSlot);
    }

    console.log(
      `[SUCCESS] Hoàn thành tạo ${createdTimeSlots.length} khung giờ làm việc cho bác sĩ ${doctorId}, ngày ${date}`
    );

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

const generateUniqueTimeSlotId = async (transaction) => {
  try {
    const result = await MODELS.TimeslotModel.findOne({
      attributes: [
        [Sequelize.fn('MAX', Sequelize.col('timeslot_id')), 'maxId'],
      ],
      where: {
        timeslot_id: {
          [Op.like]: 'TS%',
        },
      },
      transaction,
      raw: true,
    });

    let maxId = 0;
    if (result && result.maxId && result.maxId.match(/^TS\d{6}$/)) {
      maxId = parseInt(result.maxId.substring(2), 10);
    }

    maxId++;
    const newId = `TS${String(maxId).padStart(6, '0')}`;

    const existing = await MODELS.TimeslotModel.findOne({
      where: { timeslot_id: newId },
      transaction,
    });

    if (existing) {
      maxId++;
      return `TS${String(maxId).padStart(6, '0')}`;
    }

    return newId;
  } catch (error) {
    console.error('Error generating timeslot ID:', error);
    throw new Error('Không thể tạo ID cho khung giờ');
  }
};

const generateUniqueAvailabilityId = async (transaction) => {
  try {
    const result = await MODELS.AvailabilityModel.findOne({
      attributes: [[Sequelize.fn('MAX', Sequelize.col('avail_id')), 'maxId']],
      where: {
        avail_id: {
          [Op.like]: 'AV%',
        },
      },
      transaction,
      raw: true,
    });

    let maxId = 0;
    if (result && result.maxId && result.maxId.match(/^AV\d{6}$/)) {
      maxId = parseInt(result.maxId.substring(2), 10);
    }

    maxId++;
    const newId = `AV${String(maxId).padStart(6, '0')}`;

    // Kiểm tra lại
    const existing = await MODELS.AvailabilityModel.findOne({
      where: { avail_id: newId },
      transaction,
    });

    if (existing) {
      maxId++;
      return `AV${String(maxId).padStart(6, '0')}`;
    }

    return newId;
  } catch (error) {
    console.error('Error generating availability ID:', error);
    throw new Error('Không thể tạo ID cho ngày làm việc');
  }
};

const getDoctorAvailableTimeslots = async (doctorId) => {
  try {
    console.log(`Lấy khung giờ làm việc của bác sĩ ${doctorId}`);

    //lỗi include Include unexpected
    const doctorExists = await MODELS.DoctorModel.count({
      where: { doctor_id: doctorId },
    });

    if (!doctorExists) {
      console.log(`Không tìm thấy bác sĩ với ID ${doctorId}`);
      const error = new Error('Không tìm thấy thông tin bác sĩ');
      error.statusCode = StatusCodes.NOT_FOUND;
      throw error;
    }

    const availability = await MODELS.AvailabilityModel.findOne({
      where: {
        doctor_id: doctorId,
      },
    });

    const morning = [];
    const afternoon = [];

    if (availability) {
      console.log(`Tìm thấy availability với ID: ${availability.avail_id}`);

      const timeslots = await MODELS.TimeslotModel.findAll({
        where: {
          avail_id: availability.avail_id,
        },
      });

      console.log(`Tìm thấy ${timeslots.length} timeslots`);

      if (timeslots.length > 0) {
        // Lấy tất cả id của timeslots
        const timeslotIds = timeslots.map((ts) => ts.timeslot_id);

        // tim appointments để kiểm tra lịch hẹn đã đặt
        const appointments = await MODELS.AppointmentModel.findAll({
          where: {
            timeslot_id: {
              [Op.in]: timeslotIds,
            },
            // THÊM: Chỉ xét những appointment có appointment_time
            appointment_time: {
              [Op.ne]: null,
            },
          },
          attributes: ['timeslot_id', 'appointment_time'],
        });

        // Tạo map để kiểm tra nhanh timeslot nào đã có lịch hẹn
        const bookedTimeslots = {};
        appointments.forEach((app) => {
          // CHỈ đánh dấu là đã book nếu có appointment_time
          if (app.appointment_time) {
            bookedTimeslots[app.timeslot_id] = true;
          }
        });

        // Xử lý từng khung giờ
        timeslots.forEach((slot) => {
          const time = slot.time_start.substring(0, 5);

          const isBooked = bookedTimeslots[slot.timeslot_id] || false;

          const timeslot = {
            timeslot_id: slot.timeslot_id,
            time,
            is_booked: isBooked,
          };

          const hour = parseInt(time.split(':')[0]);
          if (hour < 12) {
            morning.push(timeslot);
          } else {
            afternoon.push(timeslot);
          }
        });

        // Sắp xếp theo thời gian
        morning.sort((firstSlot, secondSlot) =>
          firstSlot.time.localeCompare(secondSlot.time)
        );
        afternoon.sort((firstSlot, secondSlot) =>
          firstSlot.time.localeCompare(secondSlot.time)
        );
      }
    }

    console.log(`Đã lấy khung giờ làm việc của bác sĩ ${doctorId}`);

    return {
      morning,
      afternoon,
    };
  } catch (error) {
    console.error(`[ERROR] Lỗi lấy khung giờ làm việc: ${error.message}`);
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
    throw error;
  }
};

const getAllDoctorTimeslots = async (doctorId) => {
  try {
    console.log(`Lấy tất cả lịch làm việc của bác sĩ ${doctorId}`);

    const doctorExists = await MODELS.DoctorModel.count({
      where: { doctor_id: doctorId },
    });

    if (!doctorExists) {
      const error = new Error('Không tìm thấy thông tin bác sĩ');
      error.statusCode = StatusCodes.NOT_FOUND;
      throw error;
    }

    const availabilities = await MODELS.AvailabilityModel.findAll({
      where: {
        doctor_id: doctorId,
      },
      order: [['date', 'ASC']],
      raw: true,
    });
    if (availabilities.length === 0) {
      console.log(`Bác sĩ ${doctorId} chưa có lịch làm việc nào`);
      return { schedules: [] };
    }

    const availIds = availabilities.map((avail) => avail.avail_id);

    const timeslots = await MODELS.TimeslotModel.findAll({
      where: {
        avail_id: {
          [Op.in]: availIds,
        },
      },
      raw: true,
    });

    const timeslotIds = timeslots.map((ts) => ts.timeslot_id);

    const appointments = await MODELS.AppointmentModel.findAll({
      where: {
        timeslot_id: {
          [Op.in]: timeslotIds,
        },
        appointment_time: {
          [Op.ne]: null,
        },
      },
      attributes: ['timeslot_id', 'appointment_time'],
      raw: true,
    });

    const bookedAppointmentsMap = {};
    appointments.forEach((app) => {
      if (!bookedAppointmentsMap[app.timeslot_id]) {
        bookedAppointmentsMap[app.timeslot_id] = [];
      }
      bookedAppointmentsMap[app.timeslot_id].push(app.appointment_time);
    });

    const availDateMap = {};
    availabilities.forEach((avail) => {
      availDateMap[avail.avail_id] = avail.date;
    });

    console.log('availDateMap', availDateMap);
    const schedulesByDate = {};

    timeslots.forEach((slot) => {
      const date = availDateMap[slot.avail_id];
      if (!date) return;
      const bookedTimes = bookedAppointmentsMap[slot.timeslot_id] || [];

      if (!schedulesByDate[date]) {
        schedulesByDate[date] = {
          date,
          dayOfWeek: getDayOfWeek(date),
          timeslots: [],
        };
      }

      schedulesByDate[date].timeslots.push({
        timeslot_id: slot.timeslot_id,
        time_start: slot.time_start,
        time_end: slot.time_end,
        appointment_times: bookedTimes,
        is_booked: bookedTimes.length > 0,
      });
    });

    const schedules = Object.values(schedulesByDate).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    schedules.forEach((schedule) => {
      schedule.timeslots.sort((a, b) =>
        a.time_start.localeCompare(b.time_start)
      );
    });

    console.log(
      `Đã lấy ${schedules.length} ngày làm việc của bác sĩ ${doctorId}`
    );

    return { schedules };
  } catch (error) {
    console.error(`Lỗi lấy lịch làm việc: ${error.message}`);
    throw error;
  }
};

const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  const dayNames = [
    'Chủ nhật',
    'Thứ 2',
    'Thứ 3',
    'Thứ 4',
    'Thứ 5',
    'Thứ 6',
    'Thứ 7',
  ];
  return dayNames[date.getDay()];
};

const getDoctorByID = async (doctor) => {
  try {
    const data = await doctorModel.findOneDoctor({
      where: { doctor_id: doctor.doctor_id },
    });
    const plainData = data.get({ plain: true });
    console.log('data', plainData);
    return plainData;
  } catch (error) {
    console.error('Error getting doctor by ID:', error);
    throw new Error('Không thể lấy bác sĩ');
  }
};

const updateDoctorProfile = async (
  doctorId,
  doctorData,
  currentUserId,
  userRole
) => {
  try {
    const sequelize = GET_DB();

    const transaction = await sequelize.transaction();

    try {
      const doctor = await MODELS.DoctorModel.findOne({
        where: { doctor_id: doctorId },
      });

      if (!doctor) {
        await transaction.rollback();
        throw new Error('Không tìm thấy thông tin bác sĩ');
      }

      const userId = doctor.user_id;
      if (currentUserId !== userId && userRole !== 'admin') {
        await transaction.rollback();
        throw new Error('Unauthorized');
      }

      if (
        doctorData.email ||
        doctorData.phone ||
        doctorData.first_name ||
        doctorData.last_name ||
        doctorData.gender ||
        doctorData.birthday ||
        doctorData.address
      ) {
        await MODELS.UserModel.update(
          {
            email: doctorData.email,
            phone: doctorData.phone,
            first_name: doctorData.first_name,
            last_name: doctorData.last_name,
            gender: doctorData.gender,
            birthday: doctorData.birthday,
            address: doctorData.address,
          },
          {
            where: { user_id: userId },
            transaction: transaction,
          }
        );
      }

      if (
        doctorData.bio ||
        doctorData.experience_year ||
        doctorData.first_name ||
        doctorData.last_name
      ) {
        await MODELS.DoctorModel.update(
          {
            bio: doctorData.bio,
            experience_year: doctorData.experience_year,
            first_name: doctorData.first_name,
            last_name: doctorData.last_name,
          },
          {
            where: { doctor_id: doctorId },
            transaction: transaction,
          }
        );
      }

      if (doctorData.certificate && Array.isArray(doctorData.certificate)) {
        await MODELS.CertificateModel.destroy({
          where: { doctor_id: doctorId },
          transaction: transaction,
        });

        if (doctorData.certificate.length > 0) {
          let lastCertId = await MODELS.CertificateModel.findOne({
            attributes: ['certificates_id'],
            order: [['certificates_id', 'DESC']],
            raw: true,
          });

          let nextCertId = 1;
          if (lastCertId) {
            nextCertId = parseInt(lastCertId.certificates_id.substring(2)) + 1;
          }

          const certificates = doctorData.certificate.map((cert, index) => {
            const certId = `CT${String(nextCertId + index).padStart(6, '0')}`;

            return {
              certificates_id: certId,
              doctor_id: doctorId,
              certificate: cert,
              specialization: doctorData.specialization || null,
            };
          });

          await MODELS.CertificateModel.bulkCreate(certificates, {
            transaction: transaction,
          });
        }
      }

      await transaction.commit();

      const updatedDoctor = await getDoctorByID(doctor);
      return updatedDoctor;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error in updateDoctorProfile:', error);
    throw error;
  }
};

export const createWeeklySchedule = async (
  doctorId,
  weekStartDate,
  schedule
) => {
  let transaction;

  try {
    const sequelize = GET_DB();

    transaction = await sequelize.transaction();

    const doctor = await MODELS.DoctorModel.findOne({
      where: { doctor_id: doctorId },
    });

    if (!doctor) {
      throw new Error('Không tìm thấy thông tin bác sĩ');
    }

    const startDate = new Date(weekStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const availabilities = await MODELS.AvailabilityModel.findAll({
      where: {
        doctor_id: doctorId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      transaction,
    });

    const availIds = availabilities.map((avail) => avail.avail_id);

    if (availIds.length > 0) {
      await MODELS.TimeslotModel.destroy({
        where: { avail_id: { [Op.in]: availIds } },
        transaction,
      });

      await MODELS.AvailabilityModel.destroy({
        where: { avail_id: { [Op.in]: availIds } },
        transaction,
      });
    }

    const createdSchedules = [];

    for (const daySchedule of schedule) {
      const { date, timeSlots } = daySchedule;

      const currentDate = new Date(date);
      if (currentDate < startDate || currentDate > endDate) {
        throw new Error(`Ngày ${date} không nằm trong tuần đã chọn`);
      }

      const avail_id = await generateUniqueAvailabilityId(transaction);
      await MODELS.AvailabilityModel.create(
        {
          avail_id,
          doctor_id: doctorId,
          date,
          created_at: new Date(),
          updated_at: new Date(),
        },
        { transaction }
      );

      const dayTimeslots = [];

      for (const slot of timeSlots) {
        if (!slot.time_start || !slot.time_end) {
          throw new Error('Định dạng timeSlots không hợp lệ');
        }

        const { time_start, time_end } = slot;

        if (time_start >= time_end) {
          throw new Error('Giờ bắt đầu phải sớm hơn giờ kết thúc');
        }

        const timeslot_id = await generateUniqueTimeSlotId(transaction);
        const newTimeSlot = await MODELS.TimeslotModel.create(
          {
            timeslot_id,
            avail_id,
            time_start,
            time_end,
            status: 'available',
          },
          { transaction }
        );

        dayTimeslots.push({
          timeslot_id: newTimeSlot.timeslot_id,
          time_start: newTimeSlot.time_start,
          time_end: newTimeSlot.time_end,
        });
      }

      createdSchedules.push({
        date,
        dayOfWeek: getDayOfWeek(date),
        timeslots: dayTimeslots,
      });
    }

    await transaction.commit();

    return {
      doctor_id: doctorId,
      weekStartDate,
      schedule: createdSchedules,
    };
  } catch (error) {
    console.error('Error in createWeeklySchedule:', error);

    if (transaction && !transaction.finished) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError);
      }
    }

    throw error;
  }
};

export const doctorService = {
  getAllDoctors,
  createDoctorSchedule,
  generateUniqueTimeSlotId,
  generateUniqueAvailabilityId,
  getDoctorAvailableTimeslots,
  getAllDoctorTimeslots,
  getDoctorByID,
  updateDoctorProfile,
  createWeeklySchedule,
};
