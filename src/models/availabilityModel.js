import { DataTypes } from 'sequelize';
import { GET_DB } from '~/config/mysql';

let Availability = null;

const initAvailabilityModel = () => {
  if (!Availability) {
    const sequelize = GET_DB();
    Availability = sequelize.define(
      'Availability',
      {
        avail_id: {
          type: DataTypes.STRING(20),
          primaryKey: true,
          allowNull: false,
        },
        doctor_id: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        // slot_times: {
        //   type: DataTypes.JSON,
        //   allowNull: true,
        // },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        tableName: 'availability', // không phải 'availabilities'
        timestamps: false,
      }
    );
  }
  return Availability;
};

export const availabilityModel = {
  initAvailabilityModel,
};
