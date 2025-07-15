import { CycleModel } from '../models/cycleModel';
import { addDays, subDays } from 'date-fns';
import ApiError from '../utils/ApiError.js'; // Đảm bảo đúng đường dẫn

const cycleCulate = async (data, userId) => {
  try {
    const { lastPeriodDate, cycleLength, periodLength, pillTime } = data;

    if (
      !lastPeriodDate ||
      !cycleLength ||
      !periodLength ||
      !pillTime ||
      !userId
    ) {
      throw new ApiError(400, 'Thiếu thông tin đầu vào bắt buộc.');
    }

    const periodStart = new Date(lastPeriodDate);
    const periodEnd = addDays(periodStart, periodLength - 1);

    const ovulationDay = addDays(periodStart, cycleLength - 14);
    const ovulationStart = subDays(ovulationDay, 1);
    const ovulationEnd = addDays(ovulationDay, 1);

    const fertileStart = subDays(ovulationDay, 5);
    const fertileEnd = ovulationEnd;

    const cycle = await CycleModel.create({
      user_id: userId,
      lastPeriodDate: periodStart,
      cycleLength,
      periodLength,
      pillTime,
      periodRange: {
        start: periodStart,
        end: periodEnd,
      },
      ovulationRange: {
        start: ovulationStart,
        end: ovulationEnd,
      },
      fertilityWindow: {
        start: fertileStart,
        end: fertileEnd,
      },
    });

    return cycle;
  } catch (error) {
    console.error('Lỗi khi tạo chu kỳ:', error);

    if (error instanceof ApiError) throw error;

    throw new ApiError(500, 'Đã có lỗi xảy ra trong hệ thống khi tạo chu kỳ.');
  }
};

const getCycleByUserID = async (user_id) => {
  try {
    if (!user_id) {
      throw ApiError(400, 'Thiếu thông tin đầu vào');
    }

    const cycle = await CycleModel.findOne({ user_id: user_id });
    return cycle;
  } catch (error) {
    console.error('Lỗi khi lấy chu kỳ:', error);

    if (error instanceof ApiError) throw error;

    throw new ApiError(500, 'Đã có lỗi xảy ra trong hệ thống khi lấy chu kỳ.');
  }
};

const getAllCycles = async () => {
  try {
    const cycles = await CycleModel.find({});
    return cycles;
  } catch (error) {
    console.error('Lỗi khi lấy tất cả chu kỳ:', error);

    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      'Đã có lỗi xảy ra trong hệ thống khi lấy tất cả chu kỳ.'
    );
  }
};

export const cycleService = {
  cycleCulate,
  getCycleByUserID,
  getAllCycles,
};
