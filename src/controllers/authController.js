import { authService } from '~/services/authService'
const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const token = await authService.login(email, password)
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: token
    })
  } catch (error) {
    throw new Error(error)
  }
}

export const authController = {
  login
}