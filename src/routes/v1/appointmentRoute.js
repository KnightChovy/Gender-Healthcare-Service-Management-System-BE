import express from 'express'
import { appointmentController } from '~/controllers/appointmentController'
import  isAuth  from '~/middlewares/isAuthMiddleware'
const Router = express.Router()

Router.post('/', appointmentController.createAppointment)

export const appointmentRoute = Router