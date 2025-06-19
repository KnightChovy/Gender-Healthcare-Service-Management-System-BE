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
          type: DataTypes.TINYINT(1),
          allowNull: true,
        },
        appointment_time: {
          type: DataTypes.TIME,
          allowNull: true,
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

// const createAppointment = async (appointmentData) => {
//   try {
//     console.log('appointmentData in Model', appointmentData)
//     const result = await GET_DB().transaction(async (t) => {
//       const newAppointment = await Appointment.create(appointmentData, {
//         transaction: t,
//       });
//       return newAppointment;
//     });
//     return result;
//   } catch (error) {
//     console.error('Error creating appointment with details:', error);
//     throw new Error('Failed to create appointment with details: ' + error.message);
//   }
// };
// const findOne = async (appointmentID) => {
//   try {
//     if (!appointmentID) {
//       console.error('Invalid appointmentID: Value is null or undefined');
//       throw new Error('Invalid appointmentID provided');
//     }


//     const appointment = await MODELS.Appointment.findOne({ where: { appointment_id : appointmentID}})

//     console.log('appointment found:', appointment ? 'YES' : 'NO');
//     return appointment;

//   } catch (error) {
//     console.error('Error creating appointment:', error);
//     throw new Error('Failed to find appointment: ' + error.message);
//   }
// } 
export const appointmentModel = {
  initAppointmentModel,
  // createAppointment,
}; 