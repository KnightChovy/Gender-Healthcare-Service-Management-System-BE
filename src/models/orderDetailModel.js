import { DataTypes } from 'sequelize';
import { GET_DB } from '~/config/mysql';

let OrderDetail = null;

const initOrderDetailModel = () => {
  if (!OrderDetail) {
    const sequelize = GET_DB();
    OrderDetail = sequelize.define(
      'OrderDetail',
      {
        order_detail_id: {
          type: DataTypes.STRING(20),
          primaryKey: true,
          allowNull: false,
        },
        order_id: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        service_id: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        appointment_id: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        testresult_id: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
      },
      {
        tableName: 'order_detail',
        timestamps: false,
      }
    );
  }
  return OrderDetail;
};

export const orderDetailModel = {
  initOrderDetailModel,
}; 