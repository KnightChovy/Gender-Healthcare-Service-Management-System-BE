import ApiError from '~/utils/ApiError';
import { userModel } from '~/models/userModel';
import { comparePassword, hashPassword } from '~/utils/crypto';
import { StatusCodes } from 'http-status-codes';

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

const getUserProfile = async (userId) => {
  try {
    console.log('Finding user with ID:', userId);

    const user = await userModel.getUserById(userId);

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: `Không tìm thấy thông tin người dùng với ID: ${userId}`,
      };
    }

    // Loại bỏ các thông tin nhạy cảm trước khi trả về
    const userProfile = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      birthday: user.birthday,
      avatar: user.avatar,
      address: user.address,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      status: user.status,
    };

    return userProfile;
  } catch (error) {
    console.error('Error in getUserProfile:', error);

    // Re-throw with appropriate status code and message
    throw error.statusCode
      ? error
      : {
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Lỗi khi lấy thông tin người dùng: ' + (error.message || ''),
        };
  }
};

export const userService = {
  getAllUsers,
  createUser,
  updateUser,
  changePassword,
  getUserProfile,
};
