import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { userService } from '~/services/userService';
import { clearCache } from '~/middlewares/cacheMiddleware';
import ApiError from '~/utils/ApiError';
import axios from 'axios';

const getAllUsers = async (req, res) => {
  try {
    const listAllUsers = await userService.getAllUsers();
    console.log('listAllUsers', listAllUsers);
    res.status(StatusCodes.OK).json({ listAllUsers });
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    res.status(status).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const userData = req.body;
    console.log(userData);
    const newUser = await userService.createUser(userData);

    await clearCache('user:all:*');

    res.status(StatusCodes.CREATED).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    res.status(status).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;
    const updatedUser = await userService.updateUser(userId, userData);

    await clearCache(`user:${userId}:*`);
    await clearCache('user:all:*');

    res.status(StatusCodes.OK).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    res.status(status).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;
    const msg = await userService.changePassword(userId, {
      currentPassword,
      newPassword,
    });
    console.log('Password changed successfully for user:', msg);
    return res.status(StatusCodes.OK).json({
      message: 'Đổi mật khẩu thành công',
    });
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    return res.status(status).json({ message: error.message });
  }
};

const getMyProfile = async (req, res) => {
  try {
    if (!req.jwtDecoded) {
      throw new ApiError(401, 'User not authenticated properly');
    }

    const userId = req.jwtDecoded.data?.user_id;

    if (!userId) {
      throw new ApiError(401, 'User not found');
    }

    const userProfile = await userService.getUserProfile(userId);

    res.status(StatusCodes.OK).json({
      success: true,
      userProfile,
    });
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thông tin người dùng',
    });
  }
};

const getServicesByUserId = async (req, res) => {
  try {
    const user_id = req.params.id;
    const orders = await userService.getServicesByUserId(user_id);
    return res.status(StatusCodes.OK).json({
      success: true,
      orders,
    });
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    return res.status(status).json({ message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointment_id } = req.body;
    const userId = req.jwtDecoded.data.user_id;

    if (!appointment_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Thiếu mã cuộc hẹn',
      });
    }

    const result = await userService.cancelAppointment(appointment_id, userId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Hủy cuộc hẹn thành công',
      data: result,
    });
  } catch (error) {
    console.error('Error in cancelAppointment controller:', error);
    const status = error instanceof ApiError ? error.statusCode : 500;
    return res.status(status).json({
      success: false,
      message: error.message || 'Lỗi khi hủy cuộc hẹn',
    });
  }
};

const getUserTestAppointments = async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await userService.getUserTestAppointments(user_id);

    return res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        user: result.user,
        orders: result.orders,
        total_amount: result.totalAmount,
      },
    });
  } catch (error) {
    console.error('Error in getUserTestAppointments controller:', error);
    const status = error instanceof ApiError ? error.statusCode : 500;
    return res.status(status).json({
      status: 'error',
      message:
        error.message ||
        'Không thể lấy thông tin đơn hàng và dịch vụ của người dùng',
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const manager = req.jwtDecoded;

    if (manager.data.role !== 'manager' && manager.data.role !== 'staff') {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: 'error',
        message:
          'Không có quyền truy cập. Chỉ manager và staff mới được phép xem tất cả đơn hàng.',
      });
    }

    const result = await userService.getAllOrders();

    return res.status(StatusCodes.OK).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    console.error('Error in getAllOrders controller:', error);
    const status =
      error instanceof ApiError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(status).json({
      status: 'error',
      message: error.message || 'Không thể lấy thông tin đơn hàng',
    });
  }
};

const getTestResults = async (req, res) => {
  try {
    const userId = req.jwtDecoded.data.user_id;
    const { order_id } = req.query;

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'User ID không hợp lệ',
      });
    }

    const results = await userService.getTestResults(userId, order_id);

    return res.status(StatusCodes.OK).json({
      status: 'success',
      data: results,
    });
  } catch (error) {
    console.error('Error in getTestResults controller:', error);
    const status =
      error instanceof ApiError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(status).json({
      status: 'error',
      message: error.message || 'Không thể lấy kết quả xét nghiệm',
    });
  }
};

const cancelPendingOrder = async (req, res) => {
  try {
    const { order_id } = req.body;
    const decoded = req.jwtDecoded;

    if (decoded.data.role !== 'user') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Bạn không có quyền này',
      });
    }

    const updatedOrder = await userService.cancelPendingOrder(order_id);

    try {
      if (updatedOrder.email) {
        await axios.post(
          'http://52.4.72.106:3000/v1/emails/send-order-cancellation',
          {
            email: decoded.data.email,
            user_id: decoded.data.user_id,
            order_id: order_id,
          }
        );
      }
    } catch (emailError) {
      console.error('Lỗi khi gửi email thông báo hủy đơn hàng:', emailError);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Hủy đơn hàng thành công',
      data: updatedOrder,
    });
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    return res.status(status).json({
      success: false,
      message: error.message || 'Lỗi khi hủy đơn hàng',
    });
  }
};

export const userController = {
  getAllUsers,
  createUser,
  updateUser,
  changePassword,
  getMyProfile,
  getServicesByUserId,
  cancelAppointment,
  getUserTestAppointments,
  getAllOrders,
  getTestResults,
  cancelPendingOrder,
};
