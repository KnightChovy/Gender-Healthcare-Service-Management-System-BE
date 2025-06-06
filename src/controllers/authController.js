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

    // Return tokens and user information
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

export const authController = {
  login,
};
