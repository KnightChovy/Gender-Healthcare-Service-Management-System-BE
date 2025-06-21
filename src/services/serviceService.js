import { MODELS } from '~/models/initModels';

const getAllServices = async () => {
  try {
    const services = await MODELS.ServiceTestModel.findAll();
    console.log('services', services)
    return services;
  } catch (error) {
    throw new Error('Failed to get all services: ' + error.message);
  }
};

export const serviceService = {
  getAllServices,
}; 