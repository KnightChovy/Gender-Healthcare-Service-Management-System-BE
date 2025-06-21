import express from 'express'
import { appointmentController } from '~/controllers/appointmentController'
import  isAuth  from '~/middlewares/isAuthMiddleware'
const Router = express.Router()

Router.post('/', isAuth, appointmentController.createAppointment)
Router.get('/',  appointmentController.getAllAppointments)

export const appointmentRoute = Router