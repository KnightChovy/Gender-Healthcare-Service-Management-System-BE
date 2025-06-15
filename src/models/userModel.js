// ~/models/userModel.js
import { DataTypes } from 'sequelize';
import { GET_DB } from '~/config/mysql';
import bcrypt from 'bcrypt';
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

const findOne = async (username) => {
  try {
    const UserModel = initUserModel();
    const user = await UserModel.findOne({ where: { username } });
    console.log('Searching for user with username:', username);
    return user;
  } catch (error) {
    throw new Error('Failed to retrieve users');
  }
};

const findById = async (userId) => {
  // try {
  //   const UserModel = initUserModel();
  //   const user = await UserModel.findOne({ where: { user_id: userId } });
  //   return user;
  // } catch (error) {
  //   throw new Error('Failed to find user by ID');
  // }
  try {
    console.log('Looking for user with ID:', userId);

    if (!userId) {
      console.error('Invalid userId: Value is null or undefined');
      throw new Error('Invalid user ID provided');
    }

    const UserModel = initUserModel();
    const user = await UserModel.findOne({ where: { user_id: userId } });

    console.log('User found:', user ? 'YES' : 'NO');
    return user;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw new Error(`Failed to find user by ID: ${error.message}`);
  }
};

const createUser = async (userData) => {
  try {
    const UserModel = initUserModel();

    if (!userData.user_id) {
      const latestUser = await UserModel.findOne({
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

    userData.updated_at = new Date();

    await UserModel.update(userData, { where: { user_id: userId } });

    const updatedUser = await findById(userId);
    return updatedUser;
  } catch (error) {
    console.error('Update user error:', error);
    throw new Error('Failed to update user');
  }
};

const updatePassword = async (userId, hashedPassword) => {
  try {
    const UserModel = initUserModel();
    const updated_at = new Date();
    await UserModel.update(
      {
        password: hashedPassword,
        updated_at,
      },
      {
        where: { user_id: userId },
      }
    );
    const updatedUser = await findById(userId);
    return updatedUser;
  } catch (error) {
    console.error('Lỗi cập nhật mật khẩu: ', error);
    throw new Error('Cập nhật mật khẩu không thành công');
  }
};

const getUserById = async (userId) => {
  try {
    console.log('DB query for user ID:', userId);

    const user = await User.findOne({
      where: { user_id: userId },
    });

    console.log('Query result:', user ? 'User found' : 'User not found');
    return user;
  } catch (error) {
    console.error('Database error in getUserById:', error);
    throw new Error('Database error: ' + error.message);
  }
};

export const userModel = {
  initUserModel,
  findAllUsers,
  findOne,
  findById,
  createUser,
  updateUser,
  updatePassword,
  getUserById,
};
