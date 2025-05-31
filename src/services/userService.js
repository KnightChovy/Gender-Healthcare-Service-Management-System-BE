import ApiError from '~/utils/ApiError'
import { userModel } from '~/models/userModel'

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

export const userService = {
  getAllUsers
}