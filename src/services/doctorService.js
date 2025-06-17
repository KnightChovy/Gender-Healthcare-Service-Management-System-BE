import { StatusCodes } from 'http-status-codes';
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

export const doctorService = {
  getAllDoctors,
};
