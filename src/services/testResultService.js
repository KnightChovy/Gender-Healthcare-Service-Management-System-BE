import ApiError from '~/utils/ApiError';
import { TestResultModel } from '../models/testResultModel';
import { MODELS } from '../models/initModels';

const getAll = async () => {
  try {
    const result = await TestResultModel.find();
    return result;
  } catch (error) {
    throw new ApiError(500, 'Lỗi khi lấy test result');
  }
};

const getById = async (id) => {
  try {
    if (!id) {
      throw new ApiError(404, 'không đủ thông tin để lấy kết quả');
    }
    const result = await TestResultModel.findById(id);
    return result;
  } catch (error) {
    throw new ApiError(500, 'Lỗi khi lấy test result');
  }
};

const create = async (data) => {
  const { name, good_title, good_result, bad_title, bad_result } = data;
  if (!name || !good_title || !good_result || !bad_title || !bad_result) {
    throw new ApiError(400, 'Missing required fields');
  }
  const created = await TestResultModel.create({
    name,
    good_title,
    good_result,
    bad_title,
    bad_result,
  });
  return created;
};

const createTestResults = async (order_id, test_results) => {
  try {
    const results = test_results;
    if (!Array.isArray(results) || results.length === 0) {
      throw new ApiError(400, 'Input must be a non-empty array');
    }
    const orderExists = await MODELS.OrderModel.findOne({
      where: { order_id: order_id },
    });

    if (!orderExists) {
      throw new ApiError(404, `Order with ID ${order_id} not found`);
    }
    const TestResultMySqlModel = MODELS.TestResultMySqlModel;
    const createdResults = [];

    for (const item of results) {
      const {
        service_id,
        order_id,
        result,
        conclusion,
        normal_range,
        recommendations,
        created_at,
      } = item;

      if (!service_id || !order_id || !conclusion) {
        throw new ApiError(
          400,
          'Missing required fields: service_id, order_id, or conclusion'
        );
      }

      const serviceExists = await MODELS.ServiceModel.findOne({
        where: { service_id: service_id },
      });

      if (!serviceExists) {
        throw new ApiError(404, `Service with ID ${service_id} not found`);
      }

      // Generate a unique testresult_id (TR + 6 số)
      let latest = await TestResultMySqlModel.findOne({
        attributes: ['testresult_id'],
        order: [['testresult_id', 'DESC']],
      });

      let nextId = 1;
      if (latest && latest.testresult_id) {
        const match = latest.testresult_id.match(/^TR(\d{6})$/);
        if (match) {
          nextId = parseInt(match[1], 10) + 1;
        }
      }

      const testresult_id = `TR${String(nextId).padStart(6, '0')}`;
      const created = await TestResultMySqlModel.create({
        testresult_id,
        result,
        conclusion,
        normal_range,
        recommendations,
        created_at: created_at ? new Date(created_at) : new Date(),
      });
      createdResults.push(created);
    }
    return createdResults;
  } catch (error) {
    console.error('Error in createTestResults service:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Lỗi khi tạo kết quả xét nghiệm: ${error.message}`);
  }
};

export const testResultService = {
  getAll,
  getById,
  create,
  createTestResults,
};
