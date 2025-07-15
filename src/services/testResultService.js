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

    if (!MODELS || !MODELS.OrderModel) {
      throw new ApiError(500, 'Database models are not properly initialized');
    }

    const orderExists = await MODELS.OrderModel.findOne({
      where: { order_id: order_id },
    });

    if (!orderExists) {
      throw new ApiError(404, `Order with ID ${order_id} not found`);
    }

    if (!MODELS.TestResultMySqlModel) {
      throw new ApiError(
        500,
        'TestResultMySqlModel is not properly initialized'
      );
    }

    const TestResultMySqlModel = MODELS.TestResultMySqlModel;
    const createdResults = [];

    for (const item of results) {
      const {
        service_id,
        result,
        conclusion,
        normal_range,
        recommendations,
        created_at,
      } = item;

      if (!service_id || !conclusion) {
        throw new ApiError(
          400,
          'Missing required fields: service_id or conclusion'
        );
      }

      let testresult_id;
      try {
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

        testresult_id = `TR${String(nextId).padStart(6, '0')}`;
      } catch (error) {
        console.error('Error generating testresult_id:', error);
        throw new ApiError(500, 'Error generating testresult_id');
      }

      try {
        const created = await TestResultMySqlModel.create({
          testresult_id,
          result: result || '',
          conclusion: conclusion || '',
          normal_range: normal_range || '',
          recommendations: recommendations || '',
          created_at: created_at ? new Date(created_at) : new Date(),
        });

        if (MODELS.OrderDetailModel) {
          try {
            const orderDetail = await MODELS.OrderDetailModel.findOne({
              where: {
                order_id: order_id,
                service_id: service_id,
              },
            });

            if (orderDetail) {
              await MODELS.OrderDetailModel.update(
                { testresult_id: testresult_id },
                {
                  where: {
                    order_detail_id: orderDetail.order_detail_id,
                  },
                }
              );
              console.log(
                `Updated testresult_id ${testresult_id} for order_detail_id ${orderDetail.order_detail_id}`
              );
            } else {
              console.warn(
                `No order_detail found for order_id ${order_id} and service_id ${service_id}`
              );
            }
          } catch (updateError) {
            console.error(
              'Error updating testresult_id in order_detail:',
              updateError
            );
          }
        }

        createdResults.push(created);
      } catch (error) {
        console.error('Error creating test result:', error);
        throw new ApiError(500, `Error creating test result: ${error.message}`);
      }
    }

    return createdResults;
  } catch (error) {
    console.error('Error in createTestResults:', error);
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
