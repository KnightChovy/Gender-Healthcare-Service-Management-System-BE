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

const bookingService = async (req, res) => {
  try {
    const dataBooking = req.body.bookingData
    console.log('dataBooking', dataBooking)
    const isBooking = serviceService.bookingService(dataBooking)
  } catch (error) {
    console.log('Error when booking service', error)
    return res.status().json({
      success: false,
      message: error.message || 'Failed to get services',
    });
  }
}
export const serviceController = {
  getAllServices,
  bookingService
}; 