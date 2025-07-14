import { userModel } from './userModel';
import { doctorModel } from './doctorModel';
import { appointmentModel } from './appointmentModel';
import { refreshTokenModel } from './refreshTokenModel';
import { detailAppointmentTestModel } from './detailAppointmentTestModel';
import { serviceTestModel } from './serviceTestModel';
import { timeslotModel } from './timeslotModel';
import { availabilityModel } from './availabilityModel';
import { setupDoctorAssociations } from './associations';
import { orderModel } from './orderModel';
import { orderDetailModel } from './orderDetailModel';
import { serviceCategoryModel } from './serviceCategoryModel';
import { testResultMySqlModel } from './testResultsMySqlModel';
let MODELS = {};

const initAllModels = () => {
  console.log('Initializing models...');
  MODELS.UserModel = userModel.initUserModel();
  MODELS.DoctorModel = doctorModel.initDoctorModel();
  MODELS.CertificateModel = doctorModel.initCertificateModel();
  MODELS.AppointmentModel = appointmentModel.initAppointmentModel();
  MODELS.RefreshTokenModel = refreshTokenModel.initRefreshTokenModel();
  MODELS.DetailAppointmentTestModel =
    detailAppointmentTestModel.initDetailAppointmentTestModel();
  MODELS.ServiceTestModel = serviceTestModel.initServiceTestModel();
  MODELS.TimeslotModel = timeslotModel.initTimeslotModel();
  MODELS.AvailabilityModel = availabilityModel.initAvailabilityModel();
  MODELS.OrderModel = orderModel.initOrderModel();
  MODELS.OrderDetailModel = orderDetailModel.initOrderDetailModel();
  MODELS.ServiceCategoryModel = serviceCategoryModel.initServiceCategoryModel();
  MODELS.TestResultMySqlModel = testResultMySqlModel.initTestResultModel();
  console.log('Setting up model associations...');
  setupDoctorAssociations(
    MODELS.UserModel,
    MODELS.DoctorModel,
    MODELS.CertificateModel,
    MODELS.AppointmentModel,
    MODELS.DetailAppointmentTestModel,
    MODELS.ServiceTestModel,
    MODELS.TimeslotModel,
    MODELS.AvailabilityModel,
    MODELS.OrderModel,
    MODELS.OrderDetailModel,
    MODELS.ServiceCategoryModel,
    MODELS.TestResultMySqlModel
  );
};

export { initAllModels, MODELS };
