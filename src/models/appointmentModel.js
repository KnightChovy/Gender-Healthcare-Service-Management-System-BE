import { DataTypes } from 'sequelize';
import { GET_DB } from '~/config/mysql';
import { MODELS } from './initModels';
import { detailAppointmentTestModel } from './detailAppointmentTestModel';

let Appointment = null;

const initAppointmentModel = () => {
  if (!Appointment) {
    const sequelize = GET_DB();
    Appointment = sequelize.define(
      'Appointment',
      {
        appointment_id: {
          type: DataTypes.STRING(20),
          primaryKey: true,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        doctor_id: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        timeslot_id: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        feedback: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        descriptions: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        price_apm: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
        },
        consultant_type: {
          type: DataTypes.STRING(150),
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        appointment_time: {
          type: DataTypes.TIME,
          allowNull: true,
        },
        booking: {
          type: DataTypes.TINYINT(1),
          allowNull: true,
          default: 0
        },
      },
      {
        tableName: 'appointments',
        timestamps: false,
      }
    );
  }
  return Appointment;
};

export const appointmentModel = {
  initAppointmentModel,
}; 