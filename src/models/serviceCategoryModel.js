import { DataTypes } from 'sequelize';
import { GET_DB } from '~/config/mysql';

let ServiceCategory = null;

const initServiceCategoryModel = () => {
  if (!ServiceCategory) {
    const sequelize = GET_DB();
    ServiceCategory = sequelize.define(
      'ServiceCategory',
      {
        category_id: {
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
        tableName: 'service_categories',
        timestamps: false,
      }
    );
  }
  return ServiceCategory;
};

export const serviceCategoryModel = {
  initServiceCategoryModel,
}; 