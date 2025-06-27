import ApiError from '~/utils/ApiError';
import { comparePassword, hashPassword } from '~/utils/crypto';
import { StatusCodes } from 'http-status-codes';
import { MODELS } from '~/models/initModels';
import { Op } from 'sequelize';

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
    const existingUser = await MODELS.UserModel.findOne({
      where: { username: userData.username },
    });
    if (existingUser) {
      throw new ApiError(409, 'User with this username already exists');
    }
    userData.password = hashPassword(userData.password);

    // Generate user_id if not provided
    if (!userData.user_id) {
      const latestUser = await MODELS.UserModel.findOne({
        order: [['user_id', 'DESC']],
      });
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
    const existingUser = await MODELS.UserModel.findOne({
      where: { user_id: userId },
    });
    if (!existingUser) {
      throw new ApiError(404, 'Không tìm thấy người dùng');
    }
    if (userData.password) {
      delete userData.password;
    }
    userData.updated_at = new Date();
    await MODELS.UserModel.update(userData, { where: { user_id: userId } });
    const updatedUser = await MODELS.UserModel.findOne({
      where: { user_id: userId },
    });
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
    await MODELS.UserModel.update(
      { password: hashedPassword, updated_at: new Date() },
      { where: { user_id: userId } }
    );
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

const createStaff = async (staffData) => {
  try {
    const existingUser = await MODELS.UserModel.findOne({
      where: {
        [Op.or]: [{ username: staffData.username }, { email: staffData.email }],
      },
    });

    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    staffData.password = hashPassword(staffData.password);

    const latestUser = await MODELS.UserModel.findOne({
      order: [['user_id', 'DESC']],
    });

    let nextId = 1;
    if (latestUser) {
      const latestId = parseInt(latestUser.user_id.substring(2));
      nextId = latestId + 1;
    }
    const userId = `US${nextId.toString().padStart(6, '0')}`;
    const now = new Date();

    const newUser = await MODELS.UserModel.create({
      user_id: userId,
      first_name: staffData.first_name,
      last_name: staffData.last_name,
      username: staffData.username,
      email: staffData.email,
      password: staffData.password,
      gender: staffData.gender,
      phone: staffData.phone,
      role: staffData.role,
      status: 1,
      birthday: staffData.birthday || null,
      created_at: now,
      updated_at: now,
    });

    if (staffData.role === 'doctor') {
      const latestDoctor = await MODELS.DoctorModel.findOne({
        order: [['doctor_id', 'DESC']],
      });

      let doctorId = 'DR000001';
      if (latestDoctor && latestDoctor.doctor_id) {
        try {
          const matches = latestDoctor.doctor_id.match(/^DR(\d+)$/);
          if (matches && matches[1]) {
            const latestId = parseInt(matches[1]);
            doctorId = `DR${(latestId + 1).toString().padStart(6, '0')}`;
          }
        } catch (parseError) {
          console.warn(
            'Error parsing doctor ID, using default:',
            parseError.message
          );
        }
      }

      try {
        const doctorData = {
          doctor_id: doctorId,
          user_id: userId,
          first_name: staffData.first_name,
          last_name: staffData.last_name,
          gender: staffData.gender,
          email: staffData.email,
          phone: staffData.phone,
          bio: staffData.bio || '',
          created_at: now,
          updated_at: now,
          experience_year: parseInt(staffData.experience_year || '0'),
        };

        console.log('Creating doctor with data:', doctorData);

        await MODELS.DoctorModel.create(doctorData);

        console.log('Doctor record created successfully');
      } catch (doctorError) {
        console.error(
          'Warning: Could not create doctor record but user was created:',
          doctorError.message
        );
      }
    }

    return {
      user_id: newUser.user_id,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
    };
  } catch (error) {
    console.error('Error in createStaff:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Failed to create staff: ${error.message}`);
  }
};

export const userService = {
  getAllUsers,
  createUser,
  updateUser,
  changePassword,
  getUserProfile,
  createStaff,
};
