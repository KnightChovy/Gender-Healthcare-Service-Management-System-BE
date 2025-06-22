import ApiError from '~/utils/ApiError';
import { comparePassword, hashPassword } from '~/utils/crypto';
import { StatusCodes } from 'http-status-codes';
import { MODELS } from '~/models/initModels';

const getAllUsers = async () => {
  try {
    const findAllUsers = await MODELS.UserModel.findAll();
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
    const existingUser = await MODELS.UserModel.findOne({ where: { username: userData.username } });
    if (existingUser) {
      throw new ApiError(409, 'User with this username already exists');
    }
    userData.password = hashPassword(userData.password);

    // Generate user_id if not provided
    if (!userData.user_id) {
      const latestUser = await MODELS.UserModel.findOne({ order: [['user_id', 'DESC']] });
      let nextId = 1;
      if (latestUser) {
        const latestId = parseInt(latestUser.user_id.substring(2));
        nextId = latestId + 1;
      }
      userData.user_id = `US${nextId.toString().padStart(6, '0')}`;
    }

    const now = new Date();
    userData.created_at = now;
    userData.updated_at = now;
    if (!userData.role) userData.role = 'user';
    if (!userData.status) userData.status = 1;

    const newUser = await MODELS.UserModel.create(userData);
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
    const existingUser = await MODELS.UserModel.findOne({ where: { user_id: userId } });
    if (!existingUser) {
      throw new ApiError(404, 'Không tìm thấy người dùng');
    }
    if (userData.password) {
      delete userData.password;
    }
    userData.updated_at = new Date();
    await MODELS.UserModel.update(userData, { where: { user_id: userId } });
    const updatedUser = await MODELS.UserModel.findOne({ where: { user_id: userId } });
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
    const user = await MODELS.UserModel.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new ApiError(404, 'Không tìm thấy người dùng');
    }
    const isMatch = comparePassword(currentPassword, user.password);
    if (!isMatch) {
      throw new ApiError(400, 'Mật khẩu hiện tại không đúng');
    }
    const hashedPassword = hashPassword(newPassword);
    await MODELS.UserModel.update({ password: hashedPassword, updated_at: new Date() }, { where: { user_id: userId } });
    return true;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Đổi mật khẩu không thành công');
  }
};

const getUserProfile = async (userId) => {
  try {
    console.log('Finding user with ID:', userId);
    const user = await MODELS.UserModel.findOne({ where: { user_id: userId } });
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
