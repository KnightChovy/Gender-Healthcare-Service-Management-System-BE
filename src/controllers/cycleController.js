import { StatusCodes } from 'http-status-codes';
import { cycleService } from '~/services/cycleService';
import ApiError from '~/utils/ApiError';

const cycleCulate = async (req, res, next) => {
  try {
    const data = req.body;
    const decoded = req.jwtDecoded;
    console.log('decoded', decoded.data.user_id);
    const cycle = await cycleService.cycleCulate(data, decoded.data.user_id);

    res.status(200).json({
      success: true,
      message: 'create cycle successfully',
      cycle: cycle,
    });
  } catch (error) {
    next(error);
  }
};

const getCycleByUserID = async (req, res, next) => {
  try {
    const decoded = req.jwtDecoded;
    console.log('decoded', decoded.data.user_id);
    const cycle = await cycleService.getCycleByUserID(decoded.data.user_id);

    res.status(200).json({
      success: true,
      message: 'create cycle successfully',
      cycle: cycle,
    });
  } catch (error) {
    next(error);
  }
};

export const cycleController = {
  cycleCulate,
  getCycleByUserID,
};
