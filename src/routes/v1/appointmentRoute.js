import express from 'express'
import { appointmentController } from '~/controllers/appointmentController'
import  isAuth  from '~/middlewares/isAuthMiddleware'
import isManager from '~/middlewares/isManagerMiddleware'
import isUser from '~/middlewares/isUserMiddleware'

const Router = express.Router()

Router.post('/', isAuth, isUser, appointmentController.createAppointment)
// Router.get('/', isAuth, isManager, appointmentController.getAllAppointments)

export const appointmentRoute = Router