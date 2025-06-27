import nodemailer from 'nodemailer';
import { env } from '~/config/environment';

const sendEmail = async (email) => {
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
      from: `"Gender Healthcare Service" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: 'Test Email from Gender Healthcare Service',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #4CAF50;">Test Email</h2>
          <p>Hello,</p>
          <p>This is a test email from the Gender Healthcare Service.</p>
          <p>If you received this email, the email service is working properly.</p>
          <p>Best regards,<br>Gender Healthcare Service Team</p>
        </div>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return {
      status: 'success',
      message: 'Email sent successfully',
      info: info.messageId,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      status: 'error',
      message: error.message || 'Failed to send email',
    };
  }
};

const sendPaymentReminderEmail = async (userEmail, appointmentData) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Gender Healthcare Service" <${process.env.EMAIL_USERNAME}>`,
      to: userEmail,
      subject: 'Nhắc nhở thanh toán để hoàn tất đăng ký lịch tư vấn',
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #FF9800; margin: 0;">Lịch tư vấn đã được lên lịch</h2>
        <p style="color: #888;">Vui lòng kiểm tra và thanh toán trên hệ thống để hoàn tất đăng ký.</p>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <p style="margin-top: 0;">Xin chào <strong>${appointmentData.patientName}</strong>,</p>
        <p>Chúng tôi muốn nhắc bạn rằng lịch tư vấn của bạn đã được lên lịch. Để hoàn tất quá trình đăng ký, vui lòng đăng nhập vào hệ thống và thực hiện thanh toán phí tư vấn.</p>
      </div>
      
      <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #0277bd;">Hướng dẫn thanh toán</h3>
        <p>Để hoàn tất đăng ký, vui lòng thực hiện thanh toán theo các bước sau:</p>
        <ol style="padding-left: 20px; margin-bottom: 0;">
          <li>Đăng nhập vào tài khoản của bạn trên hệ thống</li>
          <li>Chọn mục "Lịch hẹn"</li>
          <li>Chọn mục "Thanh toán"</li>
        </ol>
      </div>
      
      <div style="background-color: #fff8e1; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #ff9800;">Lưu ý quan trọng</h3>
        <ul style="padding-left: 20px; margin-bottom: 0;">
          <li>Cuộc hẹn của bạn sẽ chỉ được xác nhận sau khi thanh toán thành công.</li>
          <li>Vui lòng thanh toán trong vòng 24 giờ để tránh bị hủy lịch hẹn.</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #555;">
        <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:</p>
        <p>Email: support@genderhealthcare.com | Hotline: 0907865147</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
        <p style="margin: 0;">Trân trọng,</p>
        <p style="margin: 5px 0 0;"><strong>Đội ngũ Gender Healthcare Service</strong></p>
      </div>
    </div>
  `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Payment reminder email sent:', info.messageId);

    return {
      status: 'success',
      message: 'Payment reminder email sent successfully',
      info: info.messageId,
    };
  } catch (error) {
    console.error('Error sending payment reminder email:', error);
    return {
      status: 'error',
      message: error.message || 'Failed to send payment reminder email',
    };
  }
};

const sendBookingConfirmationEmail = async (userEmail, userData) => {
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
      from: `"Gender Healthcare Service" <${process.env.EMAIL_USERNAME}>`,
      to: userEmail,
      subject: 'Xác nhận thanh toán đặt lịch thành công',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #4CAF50; margin: 0;">Đặt lịch tư vấn thành công</h2>
            <p style="color: #888;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin-top: 0;">Xin chào <strong>${userData.patientName}</strong>,</p>
            <p>Chúng tôi xin thông báo rằng bạn đã đặt lịch tư vấn thành công tại Gender Healthcare Service.</p>
            <p>Để xem chi tiết về lịch hẹn, vui lòng đăng nhập vào hệ thống của chúng tôi và kiểm tra mục "Lịch hẹn của tôi".</p>
          </div>
          
          <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #2e7d32;">Lưu ý quan trọng</h3>
            <ul style="padding-left: 20px; margin-bottom: 0;">
              <li>Vui lòng có mặt trước giờ hẹn 15 phút</li>
              <li>Đường dẫn cuộc hẹn: https://meet.google.com/ymf-dwbi-uhy</li>
              <li>Nếu bạn cần thay đổi lịch hẹn, vui lòng liên hệ chúng tôi ít nhất 24 giờ trước giờ hẹn</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #555;">
            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:</p>
            <p>Email: support@genderhealthcare.com | Hotline: 0907865147</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
            <p style="margin: 0;">Trân trọng,</p>
            <p style="margin: 5px 0 0;"><strong>Đội ngũ Gender Healthcare Service</strong></p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent:', info.messageId);

    return {
      status: 'success',
      message: 'Booking confirmation email sent successfully',
      info: info.messageId,
    };
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return {
      status: 'error',
      message: error.message || 'Failed to send booking confirmation email',
    };
  }
};

const sendAppointmentFeedbackEmail = async (email, data) => {
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
      to: email,
      subject: 'Đánh giá dịch vụ tư vấn - Gender Healthcare',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #3B82F6; text-align: center; margin-bottom: 20px;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</h2>
        </div>
        
        <p>Xin chào <strong>${data.patientName}</strong>,</p>
        
        <p>Cuộc hẹn tư vấn của bạn với <strong>${
          data.doctorName
        }</strong> đã hoàn thành.</p>

        <div style="background-color: #ffffff; border-radius: 5px; padding: 15px; margin: 20px 0; border-left: 4px solid #3B82F6;">
          <h3 style="margin-top: 0; color: #3B82F6;">Chi tiết cuộc hẹn</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 40%; color: #666;">Loại dịch vụ:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 500;">${
                data.appointmentType || ''
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 40%; color: #666;">Ngày tư vấn:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 500;">${
                data.appointmentDate || 'Không xác định'
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 40%; color: #666;">Thời gian:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 500;">${
                data.appointmentTime || 'Không xác định'
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 40%; color: #666;">Chi phí:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 500;">${
                data.appointmentFee || ''
              }</td>
            </tr>
          </table>
        </div>
        
        <p>Để giúp chúng tôi nâng cao chất lượng dịch vụ, mong bạn dành chút thời gian đánh giá trải nghiệm:</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="${
            data.feedbackLink
          }" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Đánh giá ngay
          </a>
        </div>
        
        <p>Phản hồi của bạn rất quan trọng với chúng tôi và giúp chúng tôi cải thiện dịch vụ.</p>
        
        <div style="margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
          <p>Trân trọng,<br>
          <strong>Gender Healthcare Team</strong></p>
        </div>
      </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.response}`);

    return {
      status: 'success',
      message: 'Email đánh giá cuộc hẹn đã được gửi thành công',
      info: info.messageId,
    };
  } catch (error) {
    console.error('Error in sendAppointmentFeedbackEmail service:', error);
    return {
      status: 'error',
      message: 'Lỗi khi gửi email đánh giá cuộc hẹn',
      error: error.message,
    };
  }
};

export const emailService = {
  sendEmail,
  sendPaymentReminderEmail,
  sendBookingConfirmationEmail,
  sendAppointmentFeedbackEmail,
};
