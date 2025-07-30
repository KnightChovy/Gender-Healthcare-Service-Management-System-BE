import { DataTypes } from 'sequelize';
import { GET_DB } from '~/config/mysql';

let DetailAppointmentTest = null;

const initDetailAppointmentTestModel = () => {
  if (!DetailAppointmentTest) {
    const sequelize = GET_DB();
    DetailAppointmentTest = sequelize.define(
      'DetailAppointmentTest',
      {
        appointmentTest_id: {
          type: DataTypes.STRING(20),
          primaryKey: true,
          allowNull: false,
        },
        appointment_id: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        service_id: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
        },
      },
      {
        tableName: 'detail_appointment_tests',
        timestamps: false,
      }
    );
  }
  return DetailAppointmentTest;
};

export const detailAppointmentTestModel = {
  initDetailAppointmentTestModel,
};
