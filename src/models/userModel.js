// ~/models/userModel.js
import { DataTypes } from 'sequelize';
import { GET_DB } from '~/config/mysql';
// import { v4 as uuidv4 } from 'uuid'; // Để tạo ID ngẫu nhiên

let User = null;

const initUserModel = () => {
  if (!User) {
    const sequelize = GET_DB();
    User = sequelize.define(
      'User',
      {
        user_id: {
          type: DataTypes.STRING(20),
          primaryKey: true,
          allowNull: false,
        },
        username: { type: DataTypes.STRING(20), allowNull: false },
        password: { type: DataTypes.STRING(50), allowNull: false },
        email: {
          type: DataTypes.STRING(50),
          allowNull: true,
          validate: { isEmail: true },
        },
        phone: { type: DataTypes.STRING(15), allowNull: true },
        gender: { type: DataTypes.STRING(10), allowNull: true },
        birthday: { type: DataTypes.DATE, allowNull: true },
        avatar: { type: DataTypes.STRING(255), allowNull: true },
        address: { type: DataTypes.STRING(255), allowNull: true },
        first_name: { type: DataTypes.STRING(100), allowNull: true },
        last_name: { type: DataTypes.STRING(100), allowNull: true },
        role: { type: DataTypes.STRING(20), allowNull: true },
        status: { type: DataTypes.TINYINT(1), allowNull: true },
        created_at: { type: DataTypes.DATE, allowNull: true },
        updated_at: { type: DataTypes.DATE, allowNull: true },
      },
      {
        tableName: 'users',
        timestamps: false,
      }
    );
  }
  return User;
};

const findAllUsers = async () => {
  try {
    const UserModel = initUserModel();
    const listAllUsers = await UserModel.findAll();
    return listAllUsers;
  } catch (error) {
    throw new Error('Failed to retrieve users');
  }
};

export const findOne = async (username) => {
  try {
    const UserModel = initUserModel();
    const user = await UserModel.findOne({ where: { username } });
    console.log('Searching for user with email:', username);
    return user;
  } catch (error) {
    throw new Error('Failed to retrieve users');
  }
};

const findById = async (userId) => {
  try {
    const UserModel = initUserModel();
    const user = await UserModel.findOne({ where: { user_id: userId } });
    return user;
  } catch (error) {
    throw new Error('Failed to find user by ID');
  }
};

const createUser = async (userData) => {
  try {
    const UserModel = initUserModel();

    // Tạo user_id theo định dạng U001, U002, ...
    if (!userData.user_id) {
      // Tìm ID lớn nhất hiện tại
      const latestUser = await UserModel.findOne({
        order: [['user_id', 'DESC']],
      });

      let nextId = 1;
      if (latestUser) {
        // Nếu đã có user, lấy số từ ID cuối cùng và tăng lên 1
        const lastId = latestUser.user_id;

        if (lastId.startsWith('U')) {
          const numPart = parseInt(lastId.substring(1));
          console.log('Last user ID:', lastId, 'Parsed number:', numPart);
          if (!isNaN(numPart)) {
            nextId = numPart + 1;
          }
        }
      }

      // Format ID với padding số 0, ví dụ: U001, U010, U100
      userData.user_id = `U${nextId.toString().padStart(6, '0')}`;
    }

    const now = new Date();
    userData.created_at = now;
    userData.updated_at = now;

    if (!userData.role) {
      userData.role = 'user';
    }

    if (!userData.status) {
      userData.status = 1;
    }

    const newUser = await UserModel.create(userData);
    return newUser;
  } catch (error) {
    console.error('Create user error:', error);
    throw new Error('Failed to create new user');
  }
};

const updateUser = async (userId, userData) => {
  try {
    const UserModel = initUserModel();

    // Cập nhật thời gian
    userData.updated_at = new Date();

    // Cập nhật user
    await UserModel.update(userData, { where: { user_id: userId } });

    // Lấy và trả về user sau khi cập nhật
    const updatedUser = await findById(userId);
    return updatedUser;
  } catch (error) {
    console.error('Update user error:', error);
    throw new Error('Failed to update user');
  }
};

export const userModel = {
  initUserModel,
  findAllUsers,
  findOne,
  findById,
  createUser,
  updateUser,
};
