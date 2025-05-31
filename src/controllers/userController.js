import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const getAllUsers = async (req, res) => {
  try {
    const listAllUsers = await userService.getAllUsers()
    console.log('listAllUsers', listAllUsers)
    res.status(StatusCodes.OK).json({ listAllUsers })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

export const userController = {
  getAllUsers
}