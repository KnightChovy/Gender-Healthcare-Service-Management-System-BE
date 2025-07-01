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
    console.log('user_id', user_id)
    console.log('services', serviceData)
    console.log('appointment_id', appointment_id)
    console.log('payment_method', payment_method)
    // if(user_id){
    //   const isDuplicateService = MODELS.OrderModel.findOne
    // }
    let order_type = 'with_consultan'
    if (appointment_id) {
      const appointment = await MODELS.AppointmentModel.findOne({ where: { appointment_id: appointment_id } })
      if (appointment) {
        const isCompleted = appointment.status === 'completed'
        if (!isCompleted) {
          console.log('The appoiment must be completed')
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
    console.log('order_id', order_id)
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

    const orderDetailCreates = serviceData.map((service, idx) => {
      const order_detail_id = 'ODT' + String(baseOrderDetailId + idx).padStart(6, '0');
      return MODELS.OrderDetailModel.create({
        order_detail_id,
        order_id,
        service_id: service.service_id,
        appointment_id: service.appointment_id ? service.appointment_id : null,
        testresult_id: service.testresult_id ? service.testresult_id : null,
      });
    });
    const orderDetails = await Promise.all(orderDetailCreates);

    return {
      message: 'Booking order and order details created successfully',
      order,
      order_details: orderDetails,
    };
  } catch (error) {
    throw new Error('Failed to book directly: ' + error.message);
  }
};

export const serviceService = {
  getAllServices,
  bookingService
}; 