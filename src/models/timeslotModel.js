import { DataTypes } from 'sequelize';
import { GET_DB } from '~/config/mysql';

let Timeslot = null;

const initTimeslotModel = () => {
  if (!Timeslot) {
    const sequelize = GET_DB();
    Timeslot = sequelize.define(
      'Timeslot',
      {
        timeslot_id: {
          type: DataTypes.STRING(20),
          primaryKey: true,
          allowNull: false,
        },
        avail_id: {
          type: DataTypes.STRING(20),
          allowNull: true, // Assuming avail_id can be null initially if not linked to an availability record
        },
        time_start: {
          type: DataTypes.TIME,
          allowNull: true,
        },
        time_end: {
          type: DataTypes.TIME,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
      },
      {
        tableName: 'time_slots',
        timestamps: false,
      }
    );
  }
  return Timeslot;
};

export const timeslotModel = {
  initTimeslotModel,
}; 