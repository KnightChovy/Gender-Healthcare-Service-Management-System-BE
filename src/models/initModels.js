import { userModel } from './userModel';
import { doctorModel } from './doctorModel';
import { appointmentModel } from './appointmentModel';
import { refreshTokenModel } from './refreshTokenModel';
import { detailAppointmentTestModel } from './detailAppointmentTestModel';
import { serviceTestModel } from './serviceTestModel';
import { timeslotModel } from './timeslotModel';
import { availabilityModel } from './availabilityModel';
import { setupDoctorAssociations } from './associations';

let MODELS = {};

const initAllModels = () => {
  console.log('Initializing models...');
  MODELS.UserModel = userModel.initUserModel();
  MODELS.DoctorModel = doctorModel.initDoctorModel();
  MODELS.AppointmentModel = appointmentModel.initAppointmentModel();
  MODELS.RefreshTokenModel = refreshTokenModel.initRefreshTokenModel();
  MODELS.DetailAppointmentTestModel =
    detailAppointmentTestModel.initDetailAppointmentTestModel();
  MODELS.ServiceTestModel = serviceTestModel.initServiceTestModel();
  MODELS.TimeslotModel = timeslotModel.initTimeslotModel();
  MODELS.AvailabilityModel = availabilityModel.initAvailabilityModel();

  console.log('Setting up model associations...');
  setupDoctorAssociations(
    MODELS.UserModel,
    MODELS.DoctorModel,
    doctorModel.initCertificateModel(),
    MODELS.AppointmentModel,
    MODELS.DetailAppointmentTestModel,
    MODELS.ServiceTestModel,
    MODELS.TimeslotModel,
    MODELS.AvailabilityModel
  );
};

export { initAllModels, MODELS };
