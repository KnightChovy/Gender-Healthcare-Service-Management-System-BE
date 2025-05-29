import express from 'express'
import { StatusCodes } from 'http-status-codes'
const getAllUsers = (req, res) => {
  // const listAllUsers = ()
  res.status(StatusCodes.OK).json({ message: 'API get list users' })
}

export const userController = {
  getAllUsers
}