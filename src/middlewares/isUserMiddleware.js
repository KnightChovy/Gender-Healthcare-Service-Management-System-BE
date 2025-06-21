import ApiError from '~/utils/ApiError';

const isUser = (req, res, next) => {
  try {
    // This middleware should run after isAuth, which decodes the token
    if (!req.jwtDecoded) {
      throw new ApiError(401, 'Not authenticated. Token is missing or invalid.');
    }

    const { role } = req.jwtDecoded.data;

    if (role !== 'user') {
      throw new ApiError(403, 'Forbidden: You do not have permission. Access is restricted to users only.');
    }

    next();
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    return res.status(status).json({
      success: false,
      message: error.message || 'An error occurred during authorization.',
    });
  }
};

export default isUser; 