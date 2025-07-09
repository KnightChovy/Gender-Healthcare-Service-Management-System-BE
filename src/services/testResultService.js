import ApiError from '~/utils/ApiError';
import { TestResultModel } from '../models/testResultModel';

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

export const testResultService = {
  getAll,
  getById,
  create
}