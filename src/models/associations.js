export const setupDoctorAssociations = (UserModel,
  DoctorModel,
  CertificateModel,
  AppointmentModel,
  DetailAppointmentTestModel,
  ServiceTestModel,
  TimeslotModel,
  AvailabilityModel,
  OrderModel
) => {

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

  UserModel.hasOne(AppointmentModel, {
    foreignKey: 'user_id',
    sourceKey: 'user_id',
    as: 'appointments_user',
  });

  AppointmentModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
    as: 'appointments_user',
  });

  // Association between Appointment and Doctor
  AppointmentModel.belongsTo(DoctorModel, {
    foreignKey: 'doctor_id',
    targetKey: 'doctor_id',
    as: 'doctor',
  });

  DoctorModel.hasMany(AppointmentModel, {
    foreignKey: 'doctor_id',
    sourceKey: 'doctor_id',
    as: 'appointments',
  });

  AppointmentModel.hasMany(DetailAppointmentTestModel, {
    foreignKey: 'appointment_id',
    sourceKey: 'appointment_id',
    as: 'appointments_detail', // alias để include
  });

  DetailAppointmentTestModel.belongsTo(AppointmentModel, {
    foreignKey: 'appointment_id',
    targetKey: 'appointment_id',
    as: 'appointment',
  });

  ServiceTestModel.hasMany(DetailAppointmentTestModel, {
    foreignKey: 'service_id',
    sourceKey: 'service_id',
    as: 'service_detail',
  });

  DetailAppointmentTestModel.belongsTo(ServiceTestModel, {
    foreignKey: 'service_id',
    targetKey: 'service_id',
    as: 'serviceTest',
  });

  // Associations for Appointment and Timeslot
  AppointmentModel.belongsTo(TimeslotModel, {
    foreignKey: 'timeslot_id',
    targetKey: 'timeslot_id',
    as: 'timeslot',
  });

  TimeslotModel.hasMany(AppointmentModel, {
    foreignKey: 'timeslot_id',
    sourceKey: 'timeslot_id',
    as: 'appointments',
  });

  // Associations for Availability and Timeslot
  AvailabilityModel.hasMany(TimeslotModel, {
    foreignKey: 'avail_id',
    sourceKey: 'avail_id',
    as: 'timeslots',
  });

  TimeslotModel.belongsTo(AvailabilityModel, {
    foreignKey: 'avail_id',
    targetKey: 'avail_id',
    as: 'availability',
  });

  DoctorModel.hasMany(AvailabilityModel, {
    foreignKey: 'doctor_id',
    sourceKey: 'doctor_id',
    as: 'availabilities',
  });

  AvailabilityModel.belongsTo(DoctorModel, {
    foreignKey: 'doctor_id',
    targetKey: 'doctor_id',
    as: 'doctor',
  });

  //ODER MODEL
  OrderModel.belongsTo(AppointmentModel, {
    foreignKey: 'appointment_id',
    targetKey: 'appointment_id',
    as: 'appointment',
  })
  AppointmentModel.hasOne(OrderModel, {
    foreignKey: 'appointment_id',
    as: 'order',
  });
  OrderModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
    as: 'user_oder',
  });

  UserModel.hasMany(OrderModel, {
    foreignKey: 'user_id',
    sourceKey: 'user_id',
    as: 'orders',
  });
};
