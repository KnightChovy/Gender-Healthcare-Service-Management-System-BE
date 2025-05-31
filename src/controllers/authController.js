import { authService } from '~/services/authService'

const login = async (req, res) => {
  try {
    const { username, password } = req.body
    const { accessToken, refreshToken, user } = await authService.login(username, password)

    // Return tokens and user information
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        tokens: {
          accessToken,
          refreshToken
        },
        user
      }
    })
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Login failed',
      error: error.message
    })
  }
}

export const authController = {
  login
}