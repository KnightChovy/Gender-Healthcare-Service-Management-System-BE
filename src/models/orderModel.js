// ~/models/orderModel.js
import { DataTypes } from 'sequelize';
import { GET_DB } from '~/config/mysql';
import { MODELS } from './initModels';

let Order = null;

const initOrderModel = () => {
  if (!Order) {
    const sequelize = GET_DB();
    Order = sequelize.define(
      'Order',
      {
        order_id: {
          type: DataTypes.STRING(20),
          primaryKey: true,
          allowNull: false,
        },
        appointment_id: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        user_id: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        total_price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        payment_status: {
          type: DataTypes.ENUM('unpaid', 'paid', 'refunded', 'cancelled'),
          defaultValue: 'unpaid',
        },
        payment_method: {
          type: DataTypes.ENUM('cash', 'momo', 'vnpay', 'bank_transfer'),
          defaultValue: 'cash',
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        tableName: 'orders',
        timestamps: false,
      }
    );
  }
  return Order;
};


export const orderModel = {
  initOrderModel,
};
