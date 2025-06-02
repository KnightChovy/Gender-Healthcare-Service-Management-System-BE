import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

// Schema chung cho cả tạo mới và cập nhật user
const userSchema = Joi.object({
  user_id: Joi.string()
    .pattern(/^U[0-9]{6}$/)
    .max(20) // Tăng max length để chấp nhận IDs khi số user tăng
    .allow(null, '') // Cho phép null khi tạo mới vì sẽ được tạo tự động
    .messages({
      'string.pattern.base':
        'ID người dùng phải có dạng U + 6 chữ số (ví dụ: U123456)',
      'string.max': 'ID người dùng không được quá 20 ký tự',
    }),

  username: Joi.string().max(20).required().messages({
    'string.max': 'Tên đăng nhập không được quá 20 ký tự',
    'any.required': 'Tên đăng nhập là bắt buộc',
    'string.empty': 'Tên đăng nhập không được để trống',
  }),

  password: Joi.string().min(6).max(50).required().messages({
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
    'string.max': 'Mật khẩu không được quá 50 ký tự',
    'any.required': 'Mật khẩu là bắt buộc',
    'string.empty': 'Mật khẩu không được để trống',
  }),

  confirm_password: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Mật khẩu xác nhận không khớp với mật khẩu đã nhập',
      'any.required': 'Xác nhận mật khẩu là bắt buộc',
      'string.empty': 'Xác nhận mật khẩu không được để trống',
    }),

  email: Joi.string().email().max(50).allow(null, '').messages({
    'string.email': 'Email không hợp lệ',
    'string.max': 'Email không được quá 50 ký tự',
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .max(11)
    .allow(null, '')
    .messages({
      'string.pattern.base':
        'Số điện thoại không hợp lệ (phải có 10-11 chữ số)',
      'string.max': 'Số điện thoại không được quá 11 ký tự',
    }),

  gender: Joi.string().valid('male', 'female').max(10).allow(null, '').messages({
    'any.only': 'Giới tính phải là: male hoặc female',
  }),

  birthday: Joi.date().iso().less('now').allow(null, '').messages({
    'date.base': 'Ngày sinh không hợp lệ',
    'date.less': 'Ngày sinh phải nhỏ hơn ngày hiện tại',
  }),

  address: Joi.string().max(255).allow(null, '').messages({
    'string.max': 'Địa chỉ không được quá 255 ký tự',
  }),

  first_name: Joi.string().max(100).allow(null, '').messages({
    'string.max': 'Tên không được quá 100 ký tự',
  }),

  last_name: Joi.string().max(100).allow(null, '').messages({
    'string.max': 'Họ không được quá 100 ký tự',
  }),

  status: Joi.number()
    .valid(0, 1) // 0: inactive, 1: active
    .max(20)
    .allow(null, '')
    .default(1),
});

// Schema cho cập nhật người dùng - Linh hoạt hơn schema tạo mới
const updateUserSchema = Joi.object({
  // Các trường có thể cập nhật nhưng không bắt buộc
  username: Joi.string().max(20).optional().messages({
    'string.max': 'Tên đăng nhập không được quá 20 ký tự',
  }),

  // Mật khẩu không bắt buộc khi cập nhật
  password: Joi.string().min(6).max(50).optional().messages({
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
    'string.max': 'Mật khẩu không được quá 50 ký tự',
  }),

  confirm_password: Joi.when('password', {
    is: Joi.exist(), // Khi password tồn tại
    then: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Mật khẩu xác nhận không khớp với mật khẩu mới',
      'any.required': 'Xác nhận mật khẩu là bắt buộc khi thay đổi mật khẩu',
    }),
    otherwise: Joi.optional(), // Nếu không có password, trường này là tùy chọn
  }),

  // Giữ lại tất cả các quy tắc validation cho các trường khác từ userSchema
  email: userSchema.extract('email'),
  phone: userSchema.extract('phone'),
  gender: userSchema.extract('gender'),
  birthday: userSchema.extract('birthday'),
  address: userSchema.extract('address'),
  first_name: userSchema.extract('first_name'),
  last_name: userSchema.extract('last_name'),
  status: userSchema.extract('status'),
  user_id: userSchema.extract('user_id'),
});

export const validateCreateUser = (req, res, next) => {
  console.log('validation', req.body)
  const { error } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Dữ liệu không hợp lệ',
      errors: errorMessages,
    });
  }

  // Xóa confirm_password khỏi req.body vì không cần lưu vào DB
  delete req.body.confirm_password;

  next();
};

export const validateUpdateUser = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Dữ liệu không hợp lệ',
      errors: errorMessages,
    });
  }

  // Xóa confirm_password khỏi req.body vì không cần lưu vào DB
  delete req.body.confirm_password;

  next();
};
