import { authService } from '~/services/authService';
import ApiError from '~/utils/ApiError';

const login = async (req, res) => {
  try {
    let { username, password } = req.body;
    console.log('password: ', password);
    // password = comparePassword(password, user.password);
    const { accessToken, refreshToken, user } = await authService.login(
      username,
      password
    );

    console.log('refreshToken: ', refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        tokens: {
          accessToken,
          refreshToken,
        },
        user,
      },
    });
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 401;
    return res.status(status).json({
      success: false,
      message: error.message || 'Login failed',
      error: error.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const accessToken = await authService.refreshToken(req.body.refreshToken);
    return res.status(200).json({
      success: true,
      message: 'Refresh token successful',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 401;
    return res.status(status).json({
      success: false,
      message: error.message || 'Refresh token failed',
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    const decoded = req.jwtDecoded;
    const isLogout = await authService.logout(decoded);
    console.log('isLogout: ', isLogout);
    console.log('decoded: ', decoded);
    if (isLogout) {
      return res.status(200).json({
        success: true,
        message: 'Logout successfully',
      });
    }
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 401;
    return res.status(status).json({
      success: false,
      message: 'Logout failed',
      error: error.message,
    });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { username, newPassword, confirmPassword } = req.body;

    const response = await authService.forgetPassword(
      username,
      newPassword,
      confirmPassword
    );

    if (response.status === 'error') {
      return res.status(400).json({
        success: false,
        message: response.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Change PASSWORD successfully',
    });
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 401;
    return res.status(status).json({
      success: false,
      message: 'Change password failed',
      error: error.message,
    });
  }
};

export const authController = {
  login,
  refreshToken,
  logout,
  forgetPassword,
};
