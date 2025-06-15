import express from 'express';
import { userRoutes } from './userRoute';
import { authRoutes } from './authRoute';
import { doctorRoutes } from './doctorRoute';

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
Router.use('/users', userRoutes);
Router.use('/doctors', doctorRoutes);

export const API_V1 = Router;
