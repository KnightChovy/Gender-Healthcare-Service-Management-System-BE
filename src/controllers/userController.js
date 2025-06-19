import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { userService } from '~/services/userService';
import { clearCache } from '../middlewares/cacheMiddleware.js';
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

    // Sau khi tạo user thành công, xóa cache danh sách user
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

    // Sau khi cập nhật thành công, xóa cache của user này và danh sách users
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
    res.status(StatusCodes.OK).json({
      message: 'Đổi mật khẩu thành công',
    });
    return;
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    res.status(status).json({ message: error.message });
  }
};

const getMyProfile = async (req, res) => {
  try {
    // Kiểm tra req.user tồn tại
    if (!req.user) {
      throw new ApiError(401, 'User not authenticated properly');
    }

    const userId = req.user.data?.user_id || req.user.user_id;

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

export const userController = {
  getAllUsers,
  createUser,
  updateUser,
  changePassword,
  getMyProfile,
};
