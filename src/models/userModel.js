// ~/models/userModel.js
import { DataTypes } from 'sequelize'
import { GET_DB } from '~/config/mysql'
import bcrypt from 'bcrypt'
let User = null

const initUserModel = () => {
  if (!User) {
    const sequelize = GET_DB()
    User = sequelize.define('User', {
      user_id: { type: DataTypes.STRING(20), primaryKey: true, allowNull: false },
      username: { type: DataTypes.STRING(20), allowNull: false },
      password: { type: DataTypes.STRING(50), allowNull: false },
      email: { type: DataTypes.STRING(50), allowNull: true, validate: { isEmail: true } },
      phone: { type: DataTypes.STRING(15), allowNull: true },
      gender: { type: DataTypes.STRING(5), allowNull: true },
      birthday: { type: DataTypes.DATE, allowNull: true },
      avatar: { type: DataTypes.STRING(255), allowNull: true },
      address: { type: DataTypes.STRING(255), allowNull: true },
      first_name: { type: DataTypes.STRING(100), allowNull: true },
      last_name: { type: DataTypes.STRING(100), allowNull: true },
      role: { type: DataTypes.STRING(20), allowNull: true },
      status: { type: DataTypes.STRING(20), allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: true },
      updated_at: { type: DataTypes.DATE, allowNull: true },

    }, {
      tableName: 'users',
      timestamps: false
    })
  }
  return User
}

const findAllUsers = async () => {
  try {
    const UserModel = initUserModel()
    const listAllUsers = await UserModel.findAll()
    return listAllUsers
  } catch (error) {
    throw new Error('Failed to retrieve users')
  }
}

export const findOne = async (username) => {
  try {
    const UserModel = initUserModel()
    const user = await UserModel.findOne({ where: { username } })
    console.log('Searching for user with email:', username)
    return user
  } catch (error) {
    throw new Error('Failed to retrieve users')
  }
}

export const userModel = {
  initUserModel,
  findAllUsers
}
