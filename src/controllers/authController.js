import { authService } from '~/services/authService';

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
    return res.status(401).json({
      success: false,
      message: error.message || 'Login failed',
      error: error.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const accessToken = await authService.refreshToken(req.body.refreshToken)
    return res.status(200).json({
      success: true,
      message: 'Refresh token successful',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Refresh token failed',
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    const decoded = req.jwtDecoded
    const isLogout = await authService.logout(decoded)
    if (isLogout) {
      return res.status(200).json({
        success: true,
        message: 'Logout successfully',
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Logout failed',
      error: error.message,
    });
  }
}
export const authController = {
  login,
  refreshToken,
  logout,
};
