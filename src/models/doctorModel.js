// ~/models/doctorModel.js
import { DataTypes } from 'sequelize';
import { GET_DB } from '~/config/mysql';
import { userModel } from './userModel';

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

const findAllDoctors = async () => {
  try {
    const UserModel = userModel.initUserModel();
    const DoctorModel = initDoctorModel();
    const CertificateModel = initCertificateModel();

    // Thiết lập quan hệ
    setupAssociations();

    // Lấy tất cả bác sĩ kèm theo chứng chỉ
    const listAllDoctors = await DoctorModel.findAll({
      include: [
        {
          model: CertificateModel,
          as: 'certificates',
          attributes: ['certificates_id', 'certificate', 'specialization'],
        },
        {
          model: UserModel,
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
      ],
      order: [['doctor_id', 'ASC']],
    });

    return listAllDoctors;
  } catch (error) {
    console.error('Error finding all doctors:', error);
    throw new Error('Không thể lấy danh sách bác sĩ: ' + error.message);
  }
};

// Thiết lập mối quan hệ
const setupAssociations = () => {
  const UserModel = userModel.initUserModel();
  const DoctorModel = initDoctorModel();
  const CertificateModel = initCertificateModel();

  // Quan hệ User - Doctor (1-1)
  UserModel.hasOne(DoctorModel, {
    foreignKey: 'user_id',
    sourceKey: 'user_id',
    as: 'doctorProfile',
  });

  DoctorModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
    as: 'user',
  });

  // Quan hệ Doctor - Certificate (1-n)
  DoctorModel.hasMany(CertificateModel, {
    foreignKey: 'doctor_id',
    sourceKey: 'doctor_id',
    as: 'certificates',
  });

  CertificateModel.belongsTo(DoctorModel, {
    foreignKey: 'doctor_id',
    targetKey: 'doctor_id',
    as: 'doctor',
  });
};

export const doctorModel = {
  initDoctorModel,
  initCertificateModel,
  findAllDoctors,
  setupAssociations,
};
