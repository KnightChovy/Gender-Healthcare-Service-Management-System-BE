import { MODELS } from '~/models/initModels';
import { jwtHelper } from '~/helpers/jwt';
import { env } from '~/config/environment';
import { refreshTokenModel } from '~/models/refreshTokenModel';
import { comparePassword, hashPassword } from '~/utils/crypto';
import ApiError from '~/utils/ApiError';
import nodemailer from 'nodemailer';

const accessTokenLife = env.ACCESS_TOKEN_LIFE || '1h';
const accessTokenSecret = env.ACCESS_TOKEN_SECRET || 'hp-token-secret';
const refreshTokenLife = env.REFRESH_TOKEN_LIFE || '7d';
const refreshTokenSecret = env.REFRESH_TOKEN_SECRET || 'hp-refresh-token';

const login = async (username, password) => {
  try {
    const user = await MODELS.UserModel.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordValid = comparePassword(password, user.password);
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

    const storedToken = await refreshTokenModel.findRefreshTokenByUserId(
      user.id
    );
    if (!storedToken || storedToken.token !== refreshTokenFromClient) {
      throw new Error('Invalid refresh token');
    }

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

const logout = async (decoded) => {
  try {
    if (decoded) {
      const user = decoded.data;
      const refreshTokenRecord =
        await refreshTokenModel.findRefreshTokenByUserId(user.user_id);
      if (refreshTokenRecord) {
        await refreshTokenModel.deleteRefreshToken(refreshTokenRecord.token);
        return true;
      }
    }
  } catch (error) {
    throw new Error('Logout failed: ' + error.message);
  }
};

const forgetPassword = async (username, newPassword, confirmPassword) => {
  try {
    const user = await MODELS.UserModel.findOne({
      where: { username: username },
      raw: false,
    });

    if (!user) {
      throw new ApiError(404, 'user not found!');
    }
    console.log('newPassword:', newPassword);
    console.log('confirmPassword:', confirmPassword);
    console.log('Mật khẩu có khớp không:', newPassword === confirmPassword);

    if (newPassword !== confirmPassword) {
      return {
        status: 'error',
        message: 'Mật khẩu và xác nhận mật khẩu không khớp',
      };
    }

    const hashedPassword = hashPassword(newPassword);

    try {
      await MODELS.UserModel.update(
        { password: hashedPassword },
        { where: { user_id: user.user_id } }
      );

      console.log('đổi mật khẩu thành công');
    } catch (updateError) {
      console.error('Lỗi khi cập nhật mật khẩu:', updateError);
      throw new ApiError(500, 'Lỗi cập nhật mật khẩu: ' + updateError.message);
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: env.EMAIL_USERNAME,
          pass: env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: `"Gender Healthcare Service" <${env.EMAIL_USERNAME}>`,
        to: user.email,
        subject: 'Xác nhận thay đổi mật khẩu thành công',
        html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h2 style="color: #4CAF50; text-align: center; margin-bottom: 20px;">Mật khẩu đã được thay đổi thành công</h2>
                </div>
                
                <p>Xin chào <strong>${
                  user.first_name || user.username
                }</strong>,</p>
                
                <p>Mật khẩu tài khoản của bạn tại Gender Healthcare Service đã được thay đổi thành công.</p>
                
                <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p style="margin: 0;"><strong>Thời gian thay đổi:</strong> ${new Date().toLocaleString(
                    'vi-VN'
                  )}</p>
                </div>
                
                <div style="background-color: #f1f8ff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                  <p style="margin: 0;"><strong>Lưu ý quan trọng:</strong> Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ ngay với chúng tôi.</p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; color: #555;">
                  <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi:</p>
                  <p>Email: support@genderhealthcare.com | Hotline: 0907865147</p>
                </div>
                
                <div style="margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
                  <p style="margin: 0;">Trân trọng,</p>
                  <p style="margin: 5px 0 0;"><strong>Đội ngũ Gender Healthcare Service</strong></p>
                </div>
              </div>
            `,
      };

      await transporter.sendMail(mailOptions);
      console.log('Password change confirmation email sent to:', user.email);
    } catch (emailError) {
      console.error(
        'Error sending password change confirmation email:',
        emailError
      );
      // Không throw lỗi ở đây vì việc gửi email xác nhận là tùy chọn
    }

    return {
      status: 'success',
      message: 'Mật khẩu đã được đặt lại thành công',
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      },
    };
  } catch (error) {
    console.error('Error in verifyOTPAndResetPassword:', error);
    if (error instanceof ApiError) {
      return {
        status: 'error',
        message: error.message,
        statusCode: error.statusCode,
      };
    }
    return {
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi đặt lại mật khẩu',
      statusCode: 500,
    };
  }
};

export const authService = {
  login,
  refreshToken,
  logout,
  forgetPassword,
};
