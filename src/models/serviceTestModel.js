import { DataTypes } from 'sequelize';
import { GET_DB } from '~/config/mysql';

let ServiceTest = null;

const initServiceTestModel = () => {
  if (!ServiceTest) {
    const sequelize = GET_DB();
    ServiceTest = sequelize.define(
      'ServiceTest',
      {
        service_id: {
          type: DataTypes.STRING(20),
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
        },
        preparation_guidelines: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        result_wait_time: {
          type: DataTypes.INTEGER,
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
      },
      {
        tableName: 'services_tests',
        timestamps: false,
      }
    );
  }
  return ServiceTest;
};

export const serviceTestModel = {
  initServiceTestModel,
}; 