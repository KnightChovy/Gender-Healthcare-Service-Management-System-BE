import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { authController } from '~/controllers/authController'
import  isAuth  from '~/middlewares/isAuthMiddleware'
const Router = express.Router()

// Authentication routes
Router.post('/login', authController.login)
Router.post('/refresh-token', authController.refreshToken)
Router.delete('/logout', isAuth, authController.logout)

export const authRoutes = Router