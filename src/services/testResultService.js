import ApiError from '~/utils/ApiError';
import { TestResultModel } from '../models/testResultModel';
import { MODELS } from '../models/initModels';

const getAll = async () => {
  try {
    const result = await TestResultModel.find();
    return result
  } catch (error) {
    throw ApiError(500, 'Lỗi khi lấy test result')
  }
}

const getById = async (id) => {
  try {
    if (!id) {
      throw ApiError(404, 'không đủ thông tin để lấy kết quả')
    }
    const result = await TestResultModel.findById(id);
    return result
  } catch (error) {
    throw ApiError(500, 'Lỗi khi lấy test result')

  }
};

const create = async (data) => {
  const { name, good_title, good_result, bad_title, bad_result } = data;
  if (!name || !good_title || !good_result || !bad_title || !bad_result) {
    throw new ApiError(400, 'Missing required fields');
  }
  const created = await TestResultModel.create({ name, good_title, good_result, bad_title, bad_result });
  return created;
};

// Add MySQL test result creation
const createTestResults = async (order_id, test_results) => {
  const results = test_results
  if (!Array.isArray(results) || results.length === 0) {
    throw new ApiError(400, 'Input must be a non-empty array');
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
      throw new ApiError(400, 'Missing required fields: service_id, order_id, or conclusion');
    }
    // Generate a unique testresult_id (e.g., using timestamp + random)
    const testresult_id = `TR${Date.now()}${Math.floor(Math.random() * 10000)}`;
    const medrecord_id = order_id; // Assuming medrecord_id maps to order_id
    const created = await TestResultMySqlModel.create({
      testresult_id,
      medrecord_id,
      result,
      conclusion,
      normal_range,
      recommendations,
      created_at: created_at ? new Date(created_at) : new Date(),
    });
    createdResults.push(created);
  }
  return createdResults;
};

export const testResultService = {
  getAll,
  getById,
  create,
  createTestResults,
}