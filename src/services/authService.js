import { userModel } from '~/models/userModel';
import { jwtHelper } from '~/helpers/jwt';
import { env } from '~/config/environment';
import { refreshTokenModel } from '~/models/refreshTokenModel';
import { comparePassword } from '~/utils/crypto';

const accessTokenLife = env.ACCESS_TOKEN_LIFE || '1h';
const accessTokenSecret = env.ACCESS_TOKEN_SECRET || 'hp-token-secret';
const refreshTokenLife = env.REFRESH_TOKEN_LIFE || '3650d';
const refreshTokenSecret =
  env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';

const login = async (username, password) => {
  try {
    const user = await userModel.findOne(username);
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordValid = comparePassword(password, user.password);
    // const isMatch = isPasswordValid === password;
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Generate tokens
    const accessToken = await jwtHelper.generateToken(
      user,
      accessTokenSecret,
      accessTokenLife
    );
    const refreshToken = await jwtHelper.generateToken(
      user,
      refreshTokenSecret,
      refreshTokenLife
    );

    // Store refresh token in database
    await refreshTokenModel.createRefreshToken(user.user_id, refreshToken);

    // Return tokens and user information
    return {
      accessToken,
      refreshToken,
      user,
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Login failed: ' + error.message);
  }
};

const refreshToken = async (refreshTokenFromClient) => {
  try {
    // Verify the refresh token
    const decoded = await jwtHelper.verifyToken(
      refreshTokenFromClient,
      refreshTokenSecret
    );
    const user = decoded.data;

    // Check if refresh token exists in database
    const storedToken = await refreshTokenModel.findRefreshTokenByUserId(
      user.id
    );
    if (!storedToken || storedToken.token !== refreshTokenFromClient) {
      throw new Error('Invalid refresh token');
    }

    // Generate new access token
    const accessToken = await jwtHelper.generateToken(
      user,
      accessTokenSecret,
      accessTokenLife
    );
    return accessToken;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

const logout = async (refreshTokenFromClient) => {
  try {
    // Delete refresh token from database
    await refreshTokenModel.deleteRefreshToken(refreshTokenFromClient)
    return true
  } catch (error) {
    throw new Error('Logout failed: ' + error.message)
  }
}

export const authService = {
  login,
  refreshToken,
  logout,
}
