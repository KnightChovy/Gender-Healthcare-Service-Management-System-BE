import { DataTypes } from 'sequelize'
import { GET_DB } from '~/config/mysql'

let RefreshToken = null

const initRefreshTokenModel = () => {
  if (!RefreshToken) {
    const sequelize = GET_DB()
    RefreshToken = sequelize.define('RefreshToken', {
      user_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        primaryKey: true
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'refresh_tokens',
      timestamps: false,
      id: false  // Disable automatic id column
    })
  }
  return RefreshToken
}

const createRefreshToken = async (userId, token) => {
  try {
    const RefreshTokenModel = initRefreshTokenModel()
    const newRefreshToken = await RefreshTokenModel.create({
      user_id: userId,
      token: token
    })
    return newRefreshToken
  } catch (error) {
    throw new Error('Failed to create refresh token: ' + error.message)
  }
}

const findRefreshTokenByUserId = async (userId) => {
  try {
    const RefreshTokenModel = initRefreshTokenModel()
    console.log('userId', userId)
    const token = await RefreshTokenModel.findOne({ where: { user_id: userId } })
    return token
  } catch (error) {
    throw new Error('Failed to find refresh token: ' + error.message)
  }
}

const deleteRefreshToken = async (token) => {
  try {
    const RefreshTokenModel = initRefreshTokenModel()
    await RefreshTokenModel.destroy({ where: { token: token } })
    return true
  } catch (error) {
    throw new Error('Failed to delete refresh token: ' + error.message)
  }
}

export const refreshTokenModel = {
  initRefreshTokenModel,
  createRefreshToken,
  findRefreshTokenByUserId,
  deleteRefreshToken
}