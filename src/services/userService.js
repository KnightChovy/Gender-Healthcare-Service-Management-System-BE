import ApiError from '~/utils/ApiError'
import { userModel } from '~/models/userModel'
import { hashPassword } from '~/utils/crypto'

const getAllUsers = async () => {
  try {
    const findAllUsers = await userModel.findAllUsers()
    if (!findAllUsers) {
      throw new ApiError(404, 'No users found')
    }
    return findAllUsers
  } catch (error) {
    throw new ApiError(500, 'Failed to retrieve users')
  }
}

const createUser = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await userModel.findOne(userData.username)
    if (existingUser) {
      throw new ApiError(409, 'User with this username already exists')
    }
    console.log(userData)
    // Hash password before saving
    userData.password = hashPassword(userData.password)

    // Create new user
    const newUser = await userModel.createUser(userData)
    if (!newUser) {
      throw new ApiError(500, 'Failed to create user')
    }

    return newUser
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, 'Failed to create user')
  }
}

const updateUser = async (userId, userData) => {
  try {
    // Check if user exists
    const existingUser = await userModel.findById(userId)
    if (!existingUser) {
      throw new ApiError(404, 'User not found')
    }

    // If updating password, hash it
    if (userData.password) {
      userData.password = hashPassword(userData.password)
    }

    // Update user
    const updatedUser = await userModel.updateUser(userId, userData)
    if (!updatedUser) {
      throw new ApiError(500, 'Failed to update user')
    }

    return updatedUser
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, 'Failed to update user')
  }
}

export const userService = {
  getAllUsers,
  createUser,
  updateUser
}