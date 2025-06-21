import ApiError from '~/utils/ApiError';

export const validateAndTransformAppointmentData = (appointmentData) => {
  try {
    if (!appointmentData.user_id) {
      throw new ApiError(400, 'User ID is required');
    }

    if (!appointmentData.selectedDoctor) {
      throw new ApiError(400, 'Doctor selection is required');
    }

    const transformedData = {
      appointment: {
        user_id: appointmentData.user_id,
        doctor_id: appointmentData.selectedDoctor,
        timeslot_id: appointmentData.timeslot_id || null,
        descriptions: appointmentData.symptoms || appointmentData.notes || null,
        consultant_type: appointmentData.consultant_type || null,
        status: appointmentData.status || 'pending',
        appointment_time: appointmentData.appointment_time || null,
        price_apm: appointmentData.price_apm || null,
        booking: appointmentData.status === '0' ? 0 : 1
      }
    };

    if (transformedData.appointment.price_apm && transformedData.appointment.price_apm < 0) {
      throw new ApiError(400, 'Price cannot be negative');
    }

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', '0', '1'];
    if (transformedData.appointment.status && !validStatuses.includes(transformedData.appointment.status)) {
      throw new ApiError(400, 'Invalid status value');
    }

    if (transformedData.appointment.consultant_type && transformedData.appointment.consultant_type.length > 150) {
      throw new ApiError(400, 'Consultant type is too long (max 150 characters)');
    }

    if (transformedData.appointment.descriptions && transformedData.appointment.descriptions.length > 65535) {
      throw new ApiError(400, 'Description is too long');
    }

    return transformedData;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(400, 'Invalid appointment data: ' + error.message);
  }
};

export const appointmentValidation = {
  validateAndTransformAppointmentData
}; 