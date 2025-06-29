import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { userService } from '~/services/userService';
import { clearCache } from '~/middlewares/cacheMiddleware';
import ApiError from '~/utils/ApiError';

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

    console.log('Received data in controller:', req.body);

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
      console.log('Missing required fields:', {
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
        status: 'error',
        message: 'Vui lòng cung cấp đầy đủ thông tin cần thiết',
      });
    }

    const newStaff = await userService.createStaff(req.body);

    return res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Tạo nhân viên mới thành công',
      data: newStaff,
    });
  } catch (error) {
    console.error('Error in createStaff controller:', error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        status: 'error',
        message: error.message || 'Lỗi khi tạo nhân viên mới',
      });
  }
};

export const userController = {
  getAllUsers,
  createUser,
  updateUser,
  changePassword,
  getMyProfile,
  createStaff,
};
