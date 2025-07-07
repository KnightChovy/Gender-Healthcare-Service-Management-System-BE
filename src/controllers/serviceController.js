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
    // Lấy user_id từ token JWT thay vì body để đảm bảo an toàn
    const userId = req.jwtDecoded.data.user_id;

    // Tạo đối tượng bookingData với user_id từ token
    const {
      serviceData,
      appointment_id,
      payment_method,
      appointment_date,
      appointment_time,
    } = req.body;

    const dataBooking = {
      user_id: userId,
      serviceData,
      appointment_id,
      payment_method,
      appointment_date,
      appointment_time,
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
