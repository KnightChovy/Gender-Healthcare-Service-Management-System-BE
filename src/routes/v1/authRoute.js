import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { authController } from '~/controllers/authController'

const Router = express.Router()

// Authentication routes
Router.post('/login', authController.login)
// Router.post('/refresh-token', authController.refreshToken)
// Router.post('/logout', authController.logout)

export const authRoutes = Router