import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { userService } from '~/services/userService';

const getAllUsers = async (req, res) => {
  try {
    const listAllUsers = await userService.getAllUsers();
    console.log('listAllUsers', listAllUsers);
    res.status(StatusCodes.OK).json({ listAllUsers });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
const createUser = async (req, res) => {
  try {
    // Validation đã được thực hiện ở middleware, nên data đã hợp lệ khi đến đây
    const userData = req.body;
    const newUser = await userService.createUser(userData);
    res.status(StatusCodes.CREATED).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;
    // Gọi service để cập nhật user
    const updatedUser = await userService.updateUser(userId, userData);

    res.status(StatusCodes.OK).json({
      message: 'Cập nhật người dùng thành công',
      user: updatedUser,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
};

// Cập nhật export để bao gồm updateUser
export const userController = {
  getAllUsers,
  createUser,
  updateUser,
  // getUserById, // Nếu cần thêm hàm này
};
