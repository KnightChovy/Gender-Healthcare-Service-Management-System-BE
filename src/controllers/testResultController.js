import ApiError from '~/utils/ApiError';
import { testResultService } from '../services/testResultService';


const getAll = async (req, res, next) => {
  try {
    const results = await testResultService.getAll();
    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
}

const getById = async (req, res, next) => {
  try {
    const result = await testResultService.getById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

const create = async (req, res, next) => {
  try {
    const created = await testResultService.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

const createTestResults = async (req, res, next) => {
  try {
    const decoded = req.jwtDecoded
    if (decoded.data.role !== 'staff' && decoded.data.role !== 'manager') {
      throw ApiError(404, 'Bạn không có quyền này')
    }
    const { order_id, test_results } = req.body
    const created = await testResultService.createTestResults(order_id, test_results);
    res.status(201).json({
      success: true,
      message: 'create successfully',
      result: created
    });
  } catch (err) {
    next(err);
  }
};

export const testResultController = {
  getAll,
  getById,
  create,
  createTestResults,
}