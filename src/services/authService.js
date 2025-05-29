import { findOne } from '~/models/userModel'
import { jwtHelper } from '~/helpers/jwt'
import { env } from '~/config/environment'
const accessTokenLife = env.ACCESS_TOKEN_LIFE || '1h'
const accessTokenSecret = env.ACCESS_TOKEN_SECRET || 'your-access-token-secret'
const refreshTokenLife = env.REFRESH_TOKEN_LIFE || '3650d'
const refreshTokenSecret = env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret'
let tokenList = {}

const login = async (email, password) => {
  try {
     console.log('email:', email)
    const user = await findOne(email)
    console.log('User found:', user)
    // if (!user) {
    //   throw new Error('User not found')
    // }
    // const isMatch = user.password === password
    // if (!isMatch) {
    //   throw new Error('Invalid password')
    // }
    const accessToken = await jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife)
    const refreshToken = await jwtHelper.generateToken(user, refreshTokenSecret, refreshTokenLife)
    tokenList[refreshToken] = { accessToken, refreshToken }
    return { accessToken, refreshToken }
  } catch (error) {
    console.error('Login error:', error)
    throw new Error('Login failed: ' + error.message)
  }

}

const refreshToken = async (refreshTokenFromClient) => {
  if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
    try {
      const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret)
      const user = decoded.data
      const accessToken = await jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife)
      return accessToken
    } catch (error) {
      throw new Error('Invalid refresh token')
    }
  }
}

export const authService = {
  login,
  refreshToken
}