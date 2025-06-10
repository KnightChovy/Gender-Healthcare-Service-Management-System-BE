import { authService } from '~/services/authService';
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login to the system
 *     description: Authenticate user and return access & refresh tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                         refreshToken:
 *                           type: string
 *                     user:
 *                       type: object
 *       401:
 *         description: Login failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 *                 error:
 *                   type: string
 */
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
        message: 'Logout successful',
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
