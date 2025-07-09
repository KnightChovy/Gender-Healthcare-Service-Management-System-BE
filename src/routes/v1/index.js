import express from 'express';
import { userRoute } from './userRoute';
import { authRoutes } from './authRoute';
import { doctorRoute } from './doctorRoute';
import { appointmentRoute } from './appointmentRoute';
import { managerRoute } from './managerRoute';
import { serviceRoute } from './serviceRoute';
import { emailRoute } from './emailRoute';
import { adminRoute } from './adminRoute';
import { cycleRoute } from './cycleRoute';
import { testResultRoute } from './testResultRoute';
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
Router.use('/users', userRoute);
Router.use('/doctors', doctorRoute);
Router.use('/appointments', appointmentRoute);
Router.use('/managers', managerRoute);
Router.use('/services', serviceRoute);
Router.use('/emails', emailRoute);
Router.use('/admins', adminRoute);
Router.use('/test-results', testResultRoute);
Router.use('/cycle', cycleRoute);

export const API_V1 = Router;
