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
export const testResultController = {
  getAll,
  getById,
  create,
}