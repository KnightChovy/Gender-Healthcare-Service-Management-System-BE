import { StatusCodes } from 'http-status-codes';
import { MODELS } from '~/models/initModels';
import ApiError from '~/utils/ApiError';

const isAdmin = async (req, res, next) => {
  try {
    if (!req.jwtDecoded) {
      throw new ApiError(
        401,
        'Not authenticated. Token is missing or invalid.'
      );
    }

    const { role } = req.jwtDecoded.data;

    if (role !== 'admin') {
      throw new ApiError(
        403,
        'Forbidden: You do not have permission. Access is restricted to managers only.'
      );
    }

    next();
  } catch (error) {
    console.error('Error in isAdmin middleware:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Đã xảy ra lỗi khi kiểm tra quyền admin',
    });
  }
};

export default isAdmin;
