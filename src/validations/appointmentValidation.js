import ApiError from '~/utils/ApiError';
import Joi from 'joi';

// Joi validation schema for appointment data - only fields that match the appointment model
const appointmentSchema = Joi.object({
  user_id: Joi.string()
    .pattern(/^US\d{6}$/)
    .required()
    .messages({
      'string.pattern.base':
        'User ID must be US followed by 6 digits (e.g., US000001)',
      'any.required': 'User ID is required',
    }),

  doctor_id: Joi.string()
    .pattern(/^DR\d{6}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Doctor ID must be DR followed by 6 digits (e.g., DR000001)',
      'any.required': 'Doctor selection is required',
    }),

  timeslot_id: Joi.string()
    .pattern(/^TS\d{6}$/)
    .allow('', null)
    .optional()
    .messages({
      'string.pattern.base':
        'Timeslot ID must be TS followed by 6 digits (e.g., TS000001)',
    }),

  consultant_type: Joi.string().max(150).allow('', null).optional().messages({
    'string.max': 'Consultant type cannot exceed 150 characters',
  }),

  status: Joi.string()
    .valid('pending', 'confirmed', 'completed', 'cancelled', '0', '1')
    .default('pending')
    .optional()
    .messages({
      'any.only':
        'Status must be one of: pending, confirmed, completed, cancelled, 0, 1',
    }),

  appointment_time: Joi.string().allow('', null).optional(),

  price_apm: Joi.number()
    .min(0)
    .max(999999999.99)
    .precision(2)
    .allow(null)
    .optional()
    .messages({
      'number.min': 'Price cannot be negative',
      'number.max': 'Price cannot exceed 999,999,999.99',
    }),

  symptoms: Joi.string().max(65535).allow('', null).optional().messages({
    'string.max': 'Symptoms description cannot exceed 65,535 characters',
  }),

  notes: Joi.string().max(65535).allow('', null).optional().messages({
    'string.max': 'Notes cannot exceed 65,535 characters',
  }),
});

const feedbackSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required().precision(2).messages({
    'any.required': 'Đánh giá là bắt buộc',
  }),

  feedback: Joi.string().allow('', null).max(500).messages({
    'string.max': 'Nội dung đánh giá không được quá 500 ký tự',
  }),
});

export const validateAndTransformAppointmentData = (appointmentData) => {
  try {
    const { error, value } = appointmentSchema.validate(appointmentData, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      const errorMessages = error.details
        .map((detail) => detail.message)
        .join(', ');
      throw new ApiError(400, `Validation failed: ${errorMessages}`);
    }

    const transformedData = {
      appointment: {
        user_id: value.user_id,
        doctor_id: value.doctor_id,
        timeslot_id: value.timeslot_id || null,
        descriptions: value.symptoms || value.notes || null,
        consultant_type: value.consultant_type || null,
        status: 'pending',
        appointment_time: value.appointment_time || null,
        price_apm: value.price_apm || null,
        booking: 0,
      },
    };
    console.log('transformedData', transformedData);
    return transformedData;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(400, 'Invalid appointment data: ' + error.message);
  }
};

export const validateFeedback = (req, res, next) => {
  const { error } = feedbackSchema.validate(req.body, { abortEarly: false });
  console.log('token')
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      status: 'error',
      message: 'Dữ liệu không hợp lệ',
      errors: errorMessages,
    });
  }
  console.log('token tesst')

  next();
};

export const appointmentValidation = {
  validateAndTransformAppointmentData,
  validateFeedback
};
