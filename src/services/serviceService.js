import { MODELS } from '~/models/initModels';
import ApiError from '~/utils/ApiError';

const getAllServices = async () => {
  try {
    const services = await MODELS.ServiceTestModel.findAll();
    return services;
  } catch (error) {
    throw new Error('Failed to get all services: ' + error.message);
  }
};

const bookingService = async (bookingData) => {
  try {
    const { user_id, serviceData, appointment_id, payment_method } = bookingData;
    // if (!user_id || !order_type || !order_status || !appointment_id || !Array.isArray(serviceData) || serviceData.length === 0) {
    //   throw new Error('Missing required booking data');
    // }
    let duplicateServiceIds = [];
    let nonDuplicateServices = [];
    if (user_id) {
      const orders = await MODELS.OrderModel.findAll({ where: { user_id: user_id, order_status: 'pending' } });
      let pendingServiceIDs = []
      for (const order of orders) {
        const orderDetails = await MODELS.OrderDetailModel.findAll({ where: { order_id: order.order_id } });
        const service_ids = orderDetails.map(od => od.service_id)
        pendingServiceIDs.push(...service_ids);
      }
      console.log('pendingServiceIDs', pendingServiceIDs);
      const service_ids = serviceData.map((service) => {
        return service.service_id;
      })
      const duplicateChecks = service_ids.filter(id => pendingServiceIDs.includes(id))
      console.log('duplicateChecks', duplicateChecks)
    //  duplicateServiceIds = duplicateChecks.filter(Boolean);
      console.log('serviceData', serviceData)
      nonDuplicateServices = service_ids.filter(service_id => {
        return !duplicateChecks.includes(service_id)
      });
      console.log('nonDuplicateServices', nonDuplicateServices)
    }
    if (nonDuplicateServices.length <= 0) {
      throw new ApiError('Error, service pending')
    }
    let order_type = 'with_consultan'
    if (appointment_id) {
      const appointment = await MODELS.AppointmentModel.findOne({ where: { appointment_id: appointment_id } })
      if (appointment) {
        const isCompleted = appointment.status === 'completed'
        if (!isCompleted) {
          throw new ApiError('Error, the appointment must be completed')
        }
        order_type = 'with_consultan'
      }
    } else {
      order_type = 'directly'
    }
    const latestOrder = await MODELS.OrderModel.findOne({
      attributes: ['order_id'],
      order: [['order_id', 'DESC']],
    });
    let baseOrderId = 1;
    if (latestOrder && latestOrder.order_id) {
      const lastIdNum = parseInt(latestOrder.order_id.replace('OD', ''), 10);
      baseOrderId = lastIdNum + 1;
    }
    const order_id = 'OD' + String(baseOrderId).padStart(6, '0');
    const now = new Date();

    const order = await MODELS.OrderModel.create({
      order_id,
      user_id,
      order_type,
      payment_method,
      order_status: 'pending',
      created_at: now,
    });
    const latestOrderDetail = await MODELS.OrderDetailModel.findOne({
      attributes: ['order_detail_id'],
      order: [['order_detail_id', 'DESC']],
    });
    let baseOrderDetailId = 1;
    if (latestOrderDetail && latestOrderDetail.order_detail_id) {
      const lastDetailIdNum = parseInt(latestOrderDetail.order_detail_id.replace('ODT', ''), 10);
      baseOrderDetailId = lastDetailIdNum + 1;
    }

    const orderDetailCreates = nonDuplicateServices.map((service_id, idx) => {
      const order_detail_id = 'ODT' + String(baseOrderDetailId + idx).padStart(6, '0');
      return MODELS.OrderDetailModel.create({
        order_detail_id,
        order_id,
        service_id: service_id,
        appointment_id: appointment_id ? appointment_id : null,
        testresult_id: null,
      });
    });
    const orderDetails = await Promise.all(orderDetailCreates);

    let message = 'Booking order and order details created successfully';
    if (duplicateServiceIds.length > 0) {
      message += `. The following services were already booked and skipped: ${duplicateServiceIds.join(', ')}`;
    }
    return {
      message,
      order,
      order_details: orderDetails,
      skipped_services: duplicateServiceIds,
    };
  } catch (error) {
    throw new Error('Failed to book directly: ' + error.message);
  }
};

export const serviceService = {
  getAllServices,
  bookingService
}; 