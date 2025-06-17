import { StatusCodes } from 'http-status-codes';
import { doctorService } from '~/services/doctorService';
import { clearCache } from '../middlewares/cacheMiddleware.js';

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

export const doctorController = {
  getAllDoctors,
};
