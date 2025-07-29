// ~/models/orderModel.js
import { DataTypes } from "sequelize";
import { GET_DB } from "~/config/mysql";

let Order = null;

const initOrderModel = () => {
  if (!Order) {
    const sequelize = GET_DB();
    Order = sequelize.define(
      "Order",
      {
        order_id: {
          type: DataTypes.STRING(20),
          primaryKey: true,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        order_type: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        order_status: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        payment_method: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        tableName: "orders",
        timestamps: false,
      }
    );
  }
  return Order;
};

export const orderModel = {
  initOrderModel,
};
