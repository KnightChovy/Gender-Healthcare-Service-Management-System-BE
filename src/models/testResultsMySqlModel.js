import { DataTypes } from 'sequelize';
import { GET_DB } from '~/config/mysql';

let test_results = null;

const initTestResultModel = () => {
  if (!test_results) {
    const sequelize = GET_DB();
    test_results = sequelize.define(
      'test_results',
      {
        testresult_id: {
          type: DataTypes.STRING(20),
          primaryKey: true,
          allowNull: false,
        },
        result: {
          type: DataTypes.STRING(500),
          allowNull: true,
        },
        conclusion: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        normal_range: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        recommendations: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        image: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        tableName: 'test_results',
        timestamps: false,
      }
    );
  }
  return test_results;
};

export const testResultMySqlModel = {
  initTestResultModel,
};
