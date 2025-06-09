import ApiError from '~/utils/ApiError';
import { userModel } from '~/models/userModel';
import { comparePassword, hashPassword } from '~/utils/crypto';

const getAllUsers = async () => {
  try {
    const findAllUsers = await userModel.findAllUsers();
    if (!findAllUsers) {
      throw new ApiError(404, 'No users found');
    }
    return findAllUsers;
  } catch (error) {
    throw new ApiError(500, 'Failed to retrieve users');
  }
};

const createUser = async (userData) => {
  try {
    const existingUser = await userModel.findOne(userData.username);
    if (existingUser) {
      throw new ApiError(409, 'User with this username already exists');
    }
    userData.password = hashPassword(userData.password);

    const newUser = await userModel.createUser(userData);
    if (!newUser) {
      throw new ApiError(500, 'Failed to create user');
    }

    return newUser;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Failed to create user');
  }
};

const updateUser = async (userId, userData) => {
  try {
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      throw new ApiError(404, 'Không tìm thấy người dùng');
    }

    if (userData.password) {
      delete userData.password;
    }

    userData.updated_at = new Date();

    const updatedUser = await userModel.updateUser(userId, userData);
    if (!updatedUser) {
      throw new ApiError(500, 'Cập nhật thông tin không thành công');
    }

    return updatedUser;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Cập nhật thông tin không thành công');
  }
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new ApiError(404, 'Không tìm thấy người dùng');
    }

    const isPasswordValid = comparePassword(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new ApiError(400, 'Mật khẩu hiện tại không chính xác');
    }
    const hashedNewPassword = hashPassword(newPassword);
    const updatedUser = await userModel.updatePassword(
      userId,
      hashedNewPassword
    );
    if (!updatedUser) {
      throw new ApiError(500, 'Cập nhật mật khẩu không thành công');
    }
    return { message: 'Đổi mật khẩu thành công' };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Password change error:', error);
    throw new ApiError(500, 'Thay đổi mật khẩu không thành công');
  }
};
export const userService = {
  getAllUsers,
  createUser,
  updateUser,
  changePassword,
};
