import { serviceService } from '~/services/serviceService';
import ApiError from '~/utils/ApiError';

const getAllServices = async (req, res) => {
  try {
    const services = await serviceService.getAllServices();
    return res.status(200).json({
      success: true,
      data: services,
    });
  } catch (err) {
    const status = err instanceof ApiError ? err.statusCode : 500;
    return res.status(status).json({
      success: false,
      message: err.message || 'Failed to get services',
    });
  }
};

// const bookingService = async (req, res) => {
//   try {
//     const dataBooking = req.body.bookingData;
//     console.log('dataBooking', dataBooking)
//     const result = await serviceService.bookingService(dataBooking);
//     return res.status(200).json({
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || 'Failed to book directly',
//     });
//   }
// }

const bookingService = async (req, res) => {
  try {
    const userId = req.jwtDecoded.data.user_id
    const requestData = req.body.bookingData || req.body

    const {
      serviceData,
      appointment_id,
      payment_method,
      exam_date,
      exam_time,
    } = requestData;

    const dataBooking = {
      user_id: userId,
      serviceData,
      appointment_id,
      payment_method,
      exam_date,
      exam_time,
    };

    console.log('dataBooking', dataBooking);

    const result = await serviceService.bookingService(dataBooking);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    console.error('Error in bookingService controller:', error);

    // Xử lý status code dựa trên loại lỗi
    const statusCode = error instanceof ApiError ? error.statusCode : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi đặt dịch vụ',
    });
  }
};

export const serviceController = {
  getAllServices,
  bookingService,
};
