import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { userRoutes } from '~/routes/v1/userRoute';
import { authRoutes } from '~/routes/v1/authRoute';
import isAuth from '~/middlewares/isAuthMiddleware';

const Router = express.Router();

// Health check route
// Router.get('/health', (req, res) => {
//   res.status(StatusCodes.OK).json({
//     status: 'healthy',
//     message: 'API is running',
//     timestamp: new Date().toISOString()
//   })
// })

// Public routes (no authentication required)
Router.use('/auth', authRoutes);

// Protected routes (authentication required)
// Router.use(isAuth) // Apply authentication middleware to all routes below
Router.use('/users', userRoutes);

export const API_V1 = Router;
