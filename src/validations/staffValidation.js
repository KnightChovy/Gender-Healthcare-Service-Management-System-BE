import Joi from 'joi';

// Validation schema for updating order status
const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'paid', 'processing', 'completed', 'cancelled')
    .required()
    .messages({
      'any.only':
        'Trạng thái phải là: pending, paid, processing, completed, hoặc cancelled',
      'any.required': 'Trạng thái đơn hàng là bắt buộc',
    }),
});

// Validation schema for updating staff profile
const updateStaffProfileSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).optional().messages({
    'string.min': 'Tên phải có ít nhất 2 ký tự',
    'string.max': 'Tên không được quá 50 ký tự',
  }),
  last_name: Joi.string().min(2).max(50).optional().messages({
    'string.min': 'Họ phải có ít nhất 2 ký tự',
    'string.max': 'Họ không được quá 50 ký tự',
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Email không hợp lệ',
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Số điện thoại không hợp lệ',
    }),
  gender: Joi.string().valid('male', 'female', 'other').optional().messages({
    'any.only': 'Giới tính phải là: male, female, hoặc other',
  }),
  birthday: Joi.date().max('now').optional().messages({
    'date.max': 'Ngày sinh không thể là ngày trong tương lai',
  }),
});

// Validation schema for order data
const orderDataSchema = Joi.object({
  order_id: Joi.string().required().messages({
    'any.required': 'Mã đơn hàng là bắt buộc',
  }),
});

// Validation middleware functions
export const validateUpdateOrderStatus = (req, res, next) => {
  const { error } = updateOrderStatusSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errorMessages,
    });
  }

  next();
};

export const validateUpdateStaffProfile = (req, res, next) => {
  const { error } = updateStaffProfileSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errorMessages,
    });
  }

  next();
};

export const validateOrderData = (req, res, next) => {
  const { error } = orderDataSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errorMessages,
    });
  }

  next();
};
