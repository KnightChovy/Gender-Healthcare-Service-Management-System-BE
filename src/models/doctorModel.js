// ~/models/doctorModel.js
import { DataTypes } from 'sequelize';
import { GET_DB } from '~/config/mysql';
import { userModel } from './userModel';
import { MODELS } from './initModels';
import { setupDoctorAssociations } from './associations.js';
let Doctor = null;
let Certificate = null;

const initDoctorModel = () => {
  if (!Doctor) {
    const sequelize = GET_DB();
    Doctor = sequelize.define(
      'Doctor',
      {
        doctor_id: {
          type: DataTypes.STRING(20),
          primaryKey: true,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        first_name: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        last_name: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        bio: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        experience_year: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        tableName: 'doctors',
        timestamps: false,
      }
    );
    // Associations should be set up after all models are initialized (see associations.js or main setup)
    // Use setupDoctorAssociations from associations.js
  } 
  return Doctor;
};

const initCertificateModel = () => {
  if (!Certificate) {
    const sequelize = GET_DB();
    Certificate = sequelize.define(
      'Certificate',
      {
        certificates_id: {
          type: DataTypes.STRING(20),
          primaryKey: true,
          allowNull: false,
        },
        doctor_id: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        certificate: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        specialization: {
          type: DataTypes.STRING(200),
          allowNull: true,
        },
      },
      {
        tableName: 'certificates',
        timestamps: false,
      }
    );
  }
  return Certificate;
};

const findOneDoctor = async (options = {}) => {
  return MODELS.DoctorModel.findOne({
    include: [
      {
        model: MODELS.UserModel,
        as: 'user',
        attributes: [
          'user_id',
          'username',
          'email',
          'phone',
          'gender',
          'avatar',
          'address',
          'status',
        ],
      },
      {
        model: initCertificateModel(),
        as: 'certificates',
        attributes: ['certificates_id', 'certificate', 'specialization'],
      },
    ],
    ...options,
  });
};

const findAllDoctors = async (options = {}) => {
  return MODELS.DoctorModel.findAll({
    include: [
      {
        model: MODELS.UserModel,
        as: 'user',
        attributes: [
          'user_id',
          'username',
          'email',
          'phone',
          'gender',
          'avatar',
          'address',
          'status',
        ],
      },
      {
        model: initCertificateModel(),
        as: 'certificates',
        attributes: ['certificates_id', 'certificate', 'specialization'],
      },
    ],
    order: [['doctor_id', 'ASC']],
    ...options,
  });
};

const findByPkDoctor = async (doctorId, options = {}) => {
  return Doctor.findByPk(doctorId, {
    include: [
      {
        model: MODELS.UserModel,
        as: 'user',
        attributes: [
          'user_id',
          'username',
          'email',
          'phone',
          'gender',
          'avatar',
          'address',
          'status',
        ],
      },
      {
        model: initCertificateModel(),
        as: 'certificates',
        attributes: ['certificates_id', 'certificate', 'specialization'],
      },
    ],
    ...options,
  });
};

export const doctorModel = {
  initDoctorModel,
  initCertificateModel,
  findOneDoctor,
  findAllDoctors,
  findByPkDoctor,
};
