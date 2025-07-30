import ApiError from "~/utils/ApiError";
import { adminService } from "~/services/adminService";
import { clearCache } from "~/middlewares/cacheMiddleware";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";

const createStaff = async (req, res) => {
  try {
    const {
      username,
      password,
      first_name,
      last_name,
      gender,
      email,
      phone,
      role,
    } = req.body;

    console.log("Received data in controller:", req.body);

    if (
      !username ||
      !password ||
      !first_name ||
      !last_name ||
      !gender ||
      !email ||
      !phone ||
      !role
    ) {
      console.log("Missing required fields:", {
        username: !username,
        password: !password,
        first_name: !first_name,
        last_name: !last_name,
        gender: !gender,
        email: !email,
        phone: !phone,
        role: !role,
      });

      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Vui lòng cung cấp đầy đủ thông tin cần thiết",
      });
    }

    const newStaff = await adminService.createStaff(req.body);

    return res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Tạo nhân viên mới thành công",
      data: newStaff,
    });
  } catch (error) {
    console.error("Error in createStaff controller:", error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        status: "error",
        message: error.message || "Lỗi khi tạo nhân viên mới",
      });
  }
};

export const adminController = {
  createStaff,
};
