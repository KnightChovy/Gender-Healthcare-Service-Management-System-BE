import Joi from "joi";
import { StatusCodes } from "http-status-codes";

const userSchema = Joi.object({
  user_id: Joi.string()
    .pattern(/^US[0-9]{6}$/)
    .max(20)
    .allow(null, "")
    .messages({
      "string.pattern.base":
        "ID người dùng phải có dạng US + 6 chữ số (ví dụ: US000001)",
      "string.max": "ID người dùng không được quá 20 ký tự",
    }),

  username: Joi.string().max(20).required().messages({
    "string.max": "Tên đăng nhập không được quá 20 ký tự",
    "any.required": "Tên đăng nhập là bắt buộc",
    "string.empty": "Tên đăng nhập không được để trống",
  }),

  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.min": "Mật khẩu phải có ít nhất 8 ký tự",
      "string.pattern.base":
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
      "any.required": "Mật khẩu là bắt buộc",
      "string.empty": "Mật khẩu không được để trống",
    }),

  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Mật khẩu xác nhận không khớp với mật khẩu đã nhập",
      "any.required": "Xác nhận mật khẩu là bắt buộc",
      "string.empty": "Xác nhận mật khẩu không được để trống",
    }),

  email: Joi.string().email().max(50).allow(null, "").messages({
    "string.email": "Email không hợp lệ",
    "string.max": "Email không được quá 50 ký tự",
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .max(11)
    .allow(null, "")
    .messages({
      "string.pattern.base":
        "Số điện thoại không hợp lệ (phải có 10-11 chữ số)",
      "string.max": "Số điện thoại không được quá 11 ký tự",
    }),

  gender: Joi.string()
    .valid("male", "female")
    .max(10)
    .allow(null, "")
    .messages({
      "any.only": "Giới tính phải là: male hoặc female",
    }),

  birthday: Joi.date().iso().less("now").allow(null, "").messages({
    "date.base": "Ngày sinh không hợp lệ",
    "date.less": "Ngày sinh phải nhỏ hơn ngày hiện tại",
  }),

  address: Joi.string().max(255).allow(null, "").messages({
    "string.max": "Địa chỉ không được quá 255 ký tự",
  }),

  first_name: Joi.string().max(100).allow(null, "").messages({
    "string.max": "Tên không được quá 100 ký tự",
  }),

  last_name: Joi.string().max(100).allow(null, "").messages({
    "string.max": "Họ không được quá 100 ký tự",
  }),

  status: Joi.number().valid(0, 1).max(20).allow(null, "").default(1),
});

const updateUserSchema = Joi.object({
  username: Joi.string().max(20).optional().messages({
    "string.max": "Tên đăng nhập không được quá 20 ký tự",
  }),

  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .optional()
    .messages({
      "string.min": "Mật khẩu phải có ít nhất 8 ký tự",
      "string.pattern.base":
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
    }),

  confirm_password: Joi.when("password", {
    is: Joi.exist(),
    then: Joi.string().valid(Joi.ref("password")).required().messages({
      "any.only": "Mật khẩu xác nhận không khớp với mật khẩu mới",
      "any.required": "Xác nhận mật khẩu là bắt buộc khi thay đổi mật khẩu",
    }),
    otherwise: Joi.optional(),
  }),

  email: userSchema.extract("email"),
  phone: userSchema.extract("phone"),
  gender: userSchema.extract("gender"),
  birthday: userSchema.extract("birthday"),
  address: userSchema.extract("address"),
  first_name: userSchema.extract("first_name"),
  last_name: userSchema.extract("last_name"),
  status: userSchema.extract("status"),
  user_id: userSchema.extract("user_id"),
});

export const validateCreateUser = (req, res, next) => {
  console.log("validation", req.body);
  const { error } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Dữ liệu không hợp lệ",
      errors: errorMessages,
    });
  }

  delete req.body.confirm_password;

  next();
};

export const validateUpdateUser = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Dữ liệu không hợp lệ",
      errors: errorMessages,
    });
  }
  delete req.body.confirm_password;

  next();
};

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "any.required": "Mật khẩu hiện tại là bắt buộc!",
    "string.empty": "Mật khẩu hiện tại không được để trống!",
  }),

  newPassword: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.min": "Mật khẩu mới phải có ít nhất 8 ký tự",
      "string.pattern.base":
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
      "any.required": "Mật khẩu mới là bắt buộc!",
      "string.empty": "Mật khẩu mới không được để trống!",
    }),

  confirm_Password: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Mật khẩu xác nhận không khớp với mật khẩu mới!",
      "any.required": "Xác nhận mật khẩu là bắt buộc!",
      "string.empty": "Xác nhận mật khẩu không được để trống!",
    }),
});

const forgetPasswordSchema = Joi.object({
  username: Joi.string().max(20).required().messages({
    "string.max": "Tên đăng nhập không được quá 20 ký tự",
    "any.required": "Tên đăng nhập là bắt buộc",
    "string.empty": "Tên đăng nhập không được để trống",
  }),

  newPassword: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.min": "Mật khẩu mới phải có ít nhất 8 ký tự",
      "string.pattern.base":
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
      "any.required": "Mật khẩu mới là bắt buộc!",
      "string.empty": "Mật khẩu mới không được để trống!",
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Mật khẩu xác nhận không khớp với mật khẩu mới!",
      "any.required": "Xác nhận mật khẩu là bắt buộc!",
      "string.empty": "Xác nhận mật khẩu không được để trống!",
    }),
});

export const validateForgetPassword = (req, res, next) => {
  const { error } = forgetPasswordSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Dữ liệu không hợp lệ",
      errors: errorMessages,
    });
  }

  next();
};

export const validateChangePassword = (req, res, next) => {
  const { error } = changePasswordSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Dữ liệu không hợp lệ",
      errors: errorMessages,
    });
  }

  delete req.body.confirmPassword;

  next();
};

const staffSchema = Joi.object({
  username: Joi.string().max(20).required().messages({
    "string.max": "Tên đăng nhập không được quá 20 ký tự",
    "any.required": "Tên đăng nhập là bắt buộc",
    "string.empty": "Tên đăng nhập không được để trống",
  }),

  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.min": "Mật khẩu phải có ít nhất 8 ký tự",
      "string.pattern.base":
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
      "any.required": "Mật khẩu là bắt buộc",
      "string.empty": "Mật khẩu không được để trống",
    }),

  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Mật khẩu xác nhận không khớp với mật khẩu đã nhập",
      "any.required": "Xác nhận mật khẩu là bắt buộc",
      "string.empty": "Xác nhận mật khẩu không được để trống",
    }),

  email: Joi.string().email().max(50).required().messages({
    "string.email": "Email không hợp lệ",
    "string.max": "Email không được quá 50 ký tự",
    "any.required": "Email là bắt buộc",
    "string.empty": "Email không được để trống",
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .max(11)
    .required()
    .messages({
      "string.pattern.base":
        "Số điện thoại không hợp lệ (phải có 10-11 chữ số)",
      "string.max": "Số điện thoại không được quá 11 ký tự",
      "any.required": "Số điện thoại là bắt buộc",
      "string.empty": "Số điện thoại không được để trống",
    }),

  gender: Joi.string().valid("male", "female").required().messages({
    "any.only": "Giới tính phải là: male hoặc female",
    "any.required": "Giới tính là bắt buộc",
    "string.empty": "Giới tính không được để trống",
  }),

  first_name: Joi.string().max(100).required().messages({
    "string.max": "Họ không được quá 100 ký tự",
    "any.required": "Họ là bắt buộc",
    "string.empty": "Họ không được để trống",
  }),

  last_name: Joi.string().max(100).required().messages({
    "string.max": "Tên không được quá 100 ký tự",
    "any.required": "Tên là bắt buộc",
    "string.empty": "Tên không được để trống",
  }),

  role: Joi.string().valid("manager", "doctor", "staff").required().messages({
    "any.only": "Chức vụ phải là: manager, doctor hoặc staff",
    "any.required": "Chức vụ là bắt buộc",
    "string.empty": "Chức vụ không được để trống",
  }),

  birthday: Joi.date().allow(null).optional(),

  // experience_year: Joi.when("role", {
  //   is: "doctor",
  //   then: Joi.number().integer().min(0).required().messages({
  //     "number.base": "Số năm kinh nghiệm phải là số",
  //     "number.integer": "Số năm kinh nghiệm phải là số nguyên",
  //     "number.min": "Số năm kinh nghiệm không được âm",
  //     "any.required": "Số năm kinh nghiệm là bắt buộc cho bác sĩ",
  //   }),
  //   otherwise: Joi.number().optional(),
  // }),

  // bio: Joi.when("role", {
  //   is: "doctor",
  //   then: Joi.string().max(1000).allow("", null).messages({
  //     "string.max": "Tiểu sử không được quá 1000 ký tự",
  //   }),
  //   otherwise: Joi.string().allow("", null).optional(),
  // }),

  // specialization: Joi.when("role", {
  //   is: "doctor",
  //   then: Joi.string().required().messages({
  //     "string.empty": "Chuyên khoa không được để trống",
  //     "any.required": "Chuyên khoa là bắt buộc cho bác sĩ",
  //   }),
  //   otherwise: Joi.string().allow("", null).optional(),
  // }),

  // certificate: Joi.when("role", {
  //   is: "doctor",
  //   then: Joi.array().items(Joi.string()).min(1).required().messages({
  //     "array.base": "Chứng chỉ phải là một mảng",
  //     "array.min": "Phải có ít nhất một chứng chỉ",
  //     "any.required": "Chứng chỉ là bắt buộc cho bác sĩ",
  //   }),
  //   otherwise: Joi.array().items(Joi.string()).optional(),
  // }),

  status: Joi.number().valid(0, 1).default(1).optional(),
});

export const validateCreateStaff = (req, res, next) => {
  console.log("Staff validation data:", req.body);

  const { role } = req.body;

  const { error } = staffSchema.validate(req.body, { abortEarly: false });
  console.log("Staff validation result:", error);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    console.error("Validation errors:", errorMessages);
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "error",
      message: "Dữ liệu không hợp lệ",
      errors: errorMessages,
    });
  }
  console.log("Staff validation passed");
  if (role === "doctor") {
    if (req.body.experience_year && isNaN(Number(req.body.experience_year))) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Số năm kinh nghiệm phải là số",
      });
    }

    if (req.body.certificate && !Array.isArray(req.body.certificate)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Chứng chỉ phải là một mảng",
      });
    }
  }

  delete req.body.confirm_password;
  console.log("Staff validation completed, proceeding to next middleware");
  next();
};

const updateDoctorSchema = Joi.object({
  username: Joi.string().max(20).optional().messages({
    "string.max": "Tên đăng nhập không được quá 20 ký tự",
  }),

  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .optional()
    .messages({
      "string.min": "Mật khẩu phải có ít nhất 8 ký tự",
      "string.pattern.base":
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
    }),

  confirm_password: Joi.when("password", {
    is: Joi.exist(),
    then: Joi.string().valid(Joi.ref("password")).required().messages({
      "any.only": "Mật khẩu xác nhận không khớp với mật khẩu mới",
      "any.required": "Xác nhận mật khẩu là bắt buộc khi thay đổi mật khẩu",
    }),
    otherwise: Joi.optional(),
  }),

  email: userSchema.extract("email"),
  phone: userSchema.extract("phone"),
  gender: userSchema.extract("gender"),
  birthday: userSchema.extract("birthday"),
  address: userSchema.extract("address"),
  first_name: userSchema.extract("first_name"),
  last_name: userSchema.extract("last_name"),
  status: userSchema.extract("status"),
  user_id: userSchema.extract("user_id"),

  // Các trường đặc biệt của bác sĩ
  experience_year: Joi.number().integer().min(0).optional().messages({
    "number.base": "Số năm kinh nghiệm phải là số",
    "number.integer": "Số năm kinh nghiệm phải là số nguyên",
    "number.min": "Số năm kinh nghiệm không được âm",
  }),

  bio: Joi.string().max(1000).allow("", null).optional().messages({
    "string.max": "Tiểu sử không được quá 1000 ký tự",
  }),

  specialization: Joi.string().optional().messages({
    "string.empty": "Chuyên khoa không được để trống khi cập nhật",
  }),

  certificate: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Chứng chỉ phải là một mảng",
  }),
});

export const validateUpdateDoctor = (req, res, next) => {
  const { error } = updateDoctorSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Dữ liệu không hợp lệ",
      errors: errorMessages,
    });
  }
  delete req.body.confirm_password;

  next();
};
