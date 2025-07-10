import nodemailer from 'nodemailer';
import { env } from '~/config/environment';
import { MODELS } from '~/models/initModels';
import ApiError from '~/utils/ApiError';
import { hashPassword } from '~/utils/crypto';

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

const sendPaymentReminderEmail = async (appointmentId) => {
  try {
    const appointment = await MODELS.AppointmentModel.findByPk(appointmentId);
    if (!appointment) {
      throw new ApiError(404, 'Appointment not found');
    }

    const user = await MODELS.UserModel.findByPk(appointment.user_id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const doctor = await MODELS.DoctorModel.findByPk(appointment.doctor_id);

    let appointmentDate = 'Không xác định';
    const availability = await MODELS.AvailabilityModel.findOne({
      where: { avail_id: appointmentId.replace('AP', 'AV') },
    });

    if (availability && availability.date) {
      const dateParts = availability.date.toString().split('-');
      if (dateParts.length === 3) {
        appointmentDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      }
    }

    const timeslot = await MODELS.TimeslotModel.findByPk(
      appointment.timeslot_id
    );

    let appointmentTime = 'Không xác định';
    if (timeslot && timeslot.time_start && timeslot.time_end) {
      const startTime = timeslot.time_start.substring(0, 5) || '';
      const endTime = timeslot.time_end.substring(0, 5) || '';
      if (startTime && endTime) {
        appointmentTime = `${startTime} - ${endTime}`;
      }
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    // const paymentLink = `${frontendUrl}/payment/${appointmentId}`;

    const appointmentData = {
      patientName: `${user.last_name} ${user.first_name || ''}`.trim(),
      doctorName: doctor
        ? `Bác sĩ ${doctor.last_name} ${doctor.first_name || ''}`.trim()
        : 'Bác sĩ tư vấn',
      appointmentType: appointment.consultant_type || 'Tư vấn sức khỏe',
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
      appointmentFee: appointment.price_apm
        ? `${parseFloat(appointment.price_apm).toLocaleString('vi-VN')} VND`
        : '300.000 VND',
      paymentLink: 'http://localhost:5173/my-appointments',
    };

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
      subject: 'Nhắc nhở thanh toán để hoàn tất đăng ký lịch tư vấn',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 15px;">
          <h2 style="color: #FF9800; text-align: center; margin-bottom: 15px;">Nhắc nhở thanh toán đặt lịch</h2>
        </div>
        
        <p>Xin chào <strong>${appointmentData.patientName}</strong>,</p>
        
        <p>Chúng tôi xin nhắc nhở rằng bạn đã đặt lịch tư vấn tại Gender Healthcare Service và hiện tại đang chờ hoàn tất thanh toán.</p>

        <div style="background-color: #ffffff; border-radius: 5px; padding: 10px; margin: 15px 0; border-left: 4px solid #FF9800;">
          <h3 style="margin-top: 0; color: #FF9800;">Chi tiết cuộc hẹn</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 40%; color: #666;">Bác sĩ tư vấn:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 500;">${
                appointmentData.doctorName || 'Chưa xác định'
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 40%; color: #666;">Loại dịch vụ:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 500;">${
                appointmentData.appointmentType || 'Tư vấn sức khỏe'
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 40%; color: #666;">Ngày tư vấn:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 500;">${
                appointmentData.appointmentDate || 'Không xác định'
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 40%; color: #666;">Thời gian:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 500;">${
                appointmentData.appointmentTime || 'Không xác định'
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 40%; color: #666;">Chi phí:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 500;">${
                appointmentData.appointmentFee || 'Đang chờ thanh toán'
              }</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #fff8e1; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
          <h3 style="margin-top: 0; color: #FF9800;">Hướng dẫn thanh toán</h3>
          <ol style="padding-left: 20px; margin-bottom: 0;">
            <li>Đăng nhập vào tài khoản của bạn trên Gender Healthcare</li>
            <li>Chọn mục "Lịch hẹn của tôi" trong trang cá nhân</li>
            <li>Tìm cuộc hẹn đang chờ thanh toán và nhấn nút "Thanh toán"</li>
            <li>Chọn phương thức thanh toán phù hợp và hoàn tất giao dịch</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 15px 0;">
          <a href="${
            appointmentData.paymentLink ||
            'http://localhost:5173/my-appointments'
          }" style="background-color: #FF9800; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Thanh toán ngay
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 15px; color: #555;">
          <p>Nếu bạn đã thanh toán nhưng vẫn nhận được email này, vui lòng bỏ qua thông báo.</p>
          <p>Nếu cần hỗ trợ, vui lòng liên hệ với chúng tôi:</p>
          <p>Email: support@genderhealthcare.com | Hotline: 0907865147</p>
        </div>
        
        <div style="margin-top: 15px; border-top: 1px solid #e0e0e0; padding-top: 15px; text-align: center;">
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
      message: 'Email nhắc nhở thanh toán đã được gửi thành công',
      info: info.messageId,
      sentTo: user.email,
      appointmentId: appointmentId,
      paymentLink: 'http://localhost:5173/my-appointments',
    };
  } catch (error) {
    console.error('Error sending payment reminder email:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi khi gửi email nhắc nhở thanh toán',
      error: error.message,
    };
  }
};

const sendBookingConfirmationEmail = async (appointmentId) => {
  try {
    const appointment = await MODELS.AppointmentModel.findByPk(appointmentId);
    if (!appointment) {
      throw new ApiError(404, 'Appointment not found');
    }

    const user = await MODELS.UserModel.findByPk(appointment.user_id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const doctor = await MODELS.DoctorModel.findByPk(appointment.doctor_id);

    // Lấy thông tin về ngày hẹn từ bảng Availability
    let appointmentDate = 'Không xác định';
    const availability = await MODELS.AvailabilityModel.findOne({
      where: { avail_id: appointmentId.replace('AP', 'AV') },
    });

    if (availability && availability.date) {
      const dateParts = availability.date.toString().split('-');
      if (dateParts.length === 3) {
        appointmentDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      }
    }

    const timeslot = await MODELS.TimeslotModel.findByPk(
      appointment.timeslot_id
    );

    let appointmentTime = 'Không xác định';
    if (timeslot && timeslot.time_start && timeslot.time_end) {
      const startTime = timeslot.time_start.substring(0, 5) || '';
      const endTime = timeslot.time_end.substring(0, 5) || '';
      if (startTime && endTime) {
        appointmentTime = `${startTime} - ${endTime}`;
      }
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    // const dashboardLink = `${frontendUrl}/my-appointments`;
    // const meetingLink = `${frontendUrl}/meeting/${appointmentId}`;

    const userData = {
      patientName: `${user.last_name} ${user.first_name || ''}`.trim(),
      doctorName: doctor
        ? `Bác sĩ ${doctor.last_name} ${doctor.first_name || ''}`.trim()
        : 'Bác sĩ tư vấn',
      appointmentType: appointment.consultant_type || 'Tư vấn sức khỏe',
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
      appointmentFee: appointment.price_apm
        ? `${parseFloat(appointment.price_apm).toLocaleString('vi-VN')} VND`
        : '300.000 VND',
      appointmentMode: appointment.consultant_type,
      meetingLink: 'https://meet.google.com/ymf-dwbi-uhy',
      dashboardLink: 'http://localhost:5173/my-appointments',
    };

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
      subject: 'Xác nhận thanh toán đặt lịch thành công',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #4CAF50; text-align: center; margin-bottom: 20px;">Đặt lịch tư vấn thành công!</h2>
        </div>
        
        <p>Xin chào <strong>${userData.patientName}</strong>,</p>
        
        <p>Chúng tôi vui mừng thông báo rằng bạn đã đặt lịch và thanh toán thành công cho buổi tư vấn tại Gender Healthcare Service.</p>

        <div style="background-color: #ffffff; border-radius: 5px; padding: 15px; margin: 20px 0; border-left: 4px solid #4CAF50;">
          <h3 style="margin-top: 0; color: #4CAF50;">Chi tiết cuộc hẹn</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 40%; color: #666;">Bác sĩ tư vấn:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 500;">${
                userData.doctorName || 'Chưa xác định'
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 40%; color: #666;">Loại dịch vụ:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 500;">${
                userData.appointmentType || 'Tư vấn sức khỏe'
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 40%; color: #666;">Ngày tư vấn:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 500;">${
                userData.appointmentDate || 'Không xác định'
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 40%; color: #666;">Thời gian:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 500;">${
                userData.appointmentTime || 'Không xác định'
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 40%; color: #666;">Chi phí:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 500;">${
                userData.appointmentFee || 'Đã thanh toán'
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 40%; color: #666;">Loại tư vấn:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 500;">${
                userData.appointmentMode || 'Tư vấn chung'
              }</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #2e7d32;">Lưu ý quan trọng</h3>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li>Vui lòng có mặt trước giờ hẹn 5-10 phút để chuẩn bị</li>
            <li>Đối với tư vấn online: Sử dụng đường link sau để tham gia buổi tư vấn: <a href="${
              userData.meetingLink || 'https://meet.google.com/ymf-dwbi-uhy'
            }" style="color: #1a73e8; text-decoration: underline;">Tham gia cuộc hẹn</a></li>
            <li>Chuẩn bị sẵn các câu hỏi hoặc thông tin y tế liên quan để buổi tư vấn hiệu quả hơn</li>
            <li>Nếu cần thay đổi lịch hẹn, vui lòng thông báo trước ít nhất 24 giờ</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="${
            userData.dashboardLink || 'http://localhost:5173/my-appointments'
          }" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Xem lịch hẹn của tôi
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #555;">
          <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:</p>
          <p>Email: support@genderhealthcare.com | Hotline: 0907865147</p>
        </div>
        
        <div style="margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
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
      message: 'Email xác nhận đặt lịch đã được gửi thành công',
      info: info.messageId,
      sentTo: user.email,
      appointmentId: appointmentId,
    };
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi khi gửi email xác nhận đặt lịch',
      error: error.message,
    };
  }
};

const sendAppointmentFeedbackEmail = async (appointmentId) => {
  try {
    const appointment = await MODELS.AppointmentModel.findByPk(appointmentId);
    if (!appointment) {
      throw new ApiError(404, 'Appointment not found');
    }

    const user = await MODELS.UserModel.findByPk(appointment.user_id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const doctor = await MODELS.DoctorModel.findByPk(appointment.doctor_id);

    let appointmentDate = 'Không xác định';
    const availability = await MODELS.AvailabilityModel.findOne({
      where: { avail_id: appointmentId.replace('AP', 'AV') },
    });

    if (availability && availability.date) {
      const dateParts = availability.date.toString().split('-');
      if (dateParts.length === 3) {
        appointmentDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      }
    }

    const timeslot = await MODELS.TimeslotModel.findByPk(
      appointment.timeslot_id
    );

    let appointmentTime = 'Không xác định';
    if (timeslot && timeslot.time_start && timeslot.time_end) {
      const startTime = timeslot.time_start.substring(0, 5) || '';
      const endTime = timeslot.time_end.substring(0, 5) || '';
      if (startTime && endTime) {
        appointmentTime = `${startTime} - ${endTime}`;
      }
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const feedbackLink = `${frontendUrl}/feedback/appointment/${appointmentId}`;

    const emailData = {
      patientName: `${user.last_name} ${user.first_name || ''}`.trim(),
      doctorName:
        doctor && doctor.first_name
          ? `Bác sĩ ${doctor.last_name} ${doctor.first_name || ''}`.trim()
          : 'Bác sĩ tư vấn',
      feedbackLink: feedbackLink,
      appointmentId: appointmentId,
      appointmentType: appointment.consultant_type || 'Tư vấn chung',
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
      appointmentFee: appointment.price_apm
        ? `${parseFloat(appointment.price_apm).toLocaleString('vi-VN')} VND`
        : '350.000 VND',
    };

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
      subject: 'Đánh giá trải nghiệm cuộc hẹn của bạn',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #6200ea;">Đánh giá trải nghiệm tư vấn của bạn</h2>
        </div>
        
        <p>Xin chào <strong>${emailData.patientName}</strong>,</p>
        
        <p>Cảm ơn bạn đã sử dụng dịch vụ tư vấn của Gender Healthcare. Chúng tôi hy vọng rằng buổi tư vấn đã mang lại những thông tin hữu ích cho bạn.</p>
        
        <div style="background-color: #f3e5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #6200ea;">Chi tiết cuộc hẹn</h3>
          <p><strong>Bác sĩ:</strong> ${emailData.doctorName}</p>
          <p><strong>Loại tư vấn:</strong> ${emailData.appointmentType}</p>
          <p><strong>Ngày tư vấn:</strong> ${emailData.appointmentDate}</p>
          <p><strong>Thời gian:</strong> ${emailData.appointmentTime}</p>
        </div>
        
        <p>Phản hồi của bạn rất quan trọng đối với chúng tôi. Vui lòng dành vài phút để đánh giá trải nghiệm tư vấn. Điều này sẽ giúp chúng tôi cải thiện dịch vụ và phục vụ bạn tốt hơn trong tương lai.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${emailData.feedbackLink}" style="background-color: #6200ea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Đánh giá ngay
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 15px; color: #555;">
          <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:</p>
          <p>Email: support@genderhealthcare.com | Hotline: 0907865147</p>
        </div>
        
        <div style="margin-top: 10px; border-top: 1px solid #e0e0e0; padding-top: 10px; text-align: center;">
          <p style="margin: 0;">Trân trọng,</p>
          <p style="margin: 5px 0 0;"><strong>Đội ngũ Gender Healthcare Service</strong></p>
        </div>
      </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Feedback request email sent:', info.messageId);

    return {
      status: 'success',
      message: 'Email yêu cầu đánh giá đã được gửi thành công',
      info: info.messageId,
      sentTo: user.email,
      appointmentId: appointmentId,
      feedbackLink: feedbackLink,
    };
  } catch (error) {
    console.error('Error sending feedback email:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi khi gửi email yêu cầu đánh giá',
      error: error.message,
    };
  }
};

const sendEmailForgetPassword = async (username, email) => {
  try {
    const user = await MODELS.UserModel.findOne({
      where: { username: username, email: email },
    });

    if (!user) {
      throw new ApiError(404, 'User not found!');
    }

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
      subject: 'Mã OTP để đặt lại mật khẩu từ Gender Healthcare Service',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #3498db; text-align: center; margin-bottom: 20px;">Đặt lại mật khẩu</h2>
          </div>
          
          <p>Xin chào <strong>${user.first_name || user.username}</strong>,</p>
          
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại Gender Healthcare Service.</p>
          
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center; border: 1px solid #ddd;">
            <h3 style="margin-top: 0; color: #3498db;">Mã OTP của bạn</h3>
            <h1 style="margin: 10px 0; color: #333; letter-spacing: 5px; font-size: 32px;">123456</h1>
            <p style="margin: 0; color: #777;">Mã này có hiệu lực trong vòng 15 phút</p>
          </div>
          
          <div style="background-color: #f1f8ff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 0;"><strong>Lưu ý quan trọng:</strong> Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ ngay với chúng tôi.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #555;">
            <p>Nếu bạn gặp khó khăn, vui lòng liên hệ với chúng tôi:</p>
            <p>Email: support@genderhealthcare.com | Hotline: 0907865147</p>
          </div>
          
          <div style="margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
            <p style="margin: 0;">Trân trọng,</p>
            <p style="margin: 5px 0 0;"><strong>Đội ngũ Gender Healthcare Service</strong></p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset OTP email sent:', info.messageId);

    return {
      status: 'success',
      message: 'Email gửi OTP để đặt lại mật khẩu thành công',
      info: info.messageId,
      sentTo: user.email,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      status: 'error',
      message: error.message || 'Failed to send email',
    };
  }
};

const sendUserServicesSummaryEmail = async (user_id) => {
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

    const user = await MODELS.UserModel.findOne({
      where: { user_id },
      attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone'],
    });

    if (!user) {
      return {
        status: 'error',
        message: `Không tìm thấy người dùng với ID: ${user_id}`,
      };
    }

    const orders = await MODELS.OrderModel.findAll({
      where: { user_id },
      order: [['created_at', 'DESC']],
    });

    if (!orders || orders.length === 0) {
      return {
        status: 'error',
        message: `Không tìm thấy đơn hàng nào cho người dùng: ${user_id}`,
      };
    }

    const allOrderDetails = [];
    let totalAmount = 0;

    for (const order of orders) {
      const orderDetails = await MODELS.OrderDetailModel.findAll({
        where: { order_id: order.order_id },
        include: [
          {
            model: MODELS.ServiceTestModel,
            as: 'service',
            attributes: [
              'service_id',
              'name',
              'price',
              'description',
              'preparation_guidelines',
            ],
          },
        ],
      });

      orderDetails.forEach((detail) => {
        if (detail.service) {
          allOrderDetails.push({
            order_id: order.order_id,
            order_status: order.order_status,
            payment_method: order.payment_method || 'Chưa thanh toán',
            created_at: order.created_at,
            service: detail.service,
          });

          const price = detail.service.price
            ? parseFloat(detail.service.price)
            : 0;
          totalAmount += price;
        }
      });
    }

    const servicesList = allOrderDetails
      .map((detail) => {
        const orderDate = new Date(detail.created_at).toLocaleDateString(
          'vi-VN',
          {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }
        );

        const paymentStatus =
          '<span style="color: #4CAF50;">Đã thanh toán</span>';

        return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${
            detail.service?.name || 'Dịch vụ'
          }</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${
            detail.order_id
          }</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${orderDate}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${paymentStatus}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Intl.NumberFormat(
            'vi-VN',
            { style: 'currency', currency: 'VND' }
          ).format(detail.service?.price || 0)}</td>
        </tr>
      `;
      })
      .join('');

    const uniqueGuidelines = [
      ...new Set(
        allOrderDetails
          .filter((detail) => detail.service?.preparation_guidelines)
          .map((detail) => detail.service.preparation_guidelines)
      ),
    ];

    const preparationGuidelines = uniqueGuidelines
      .map((guideline) => `<li style="margin-bottom: 8px;">${guideline}</li>`)
      .join('');

    // Tạo template email
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #4a90e2; text-align: center;">Thông tin dịch vụ y tế của bạn</h2>
        </div>
        
        <p>Xin chào <strong>${user?.first_name || ''} ${
      user?.last_name || ''
    }</strong>,</p>
        
        <p>Dưới đây là thông tin tổng hợp về các dịch vụ y tế mà bạn đã đặt tại GenCare:</p>
        
        <div style="background-color: #ffffff; border-radius: 5px; padding: 15px; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h3 style="color: #4a90e2; margin-top: 0;">Danh sách dịch vụ đã đặt</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Tên dịch vụ</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Mã đơn hàng</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Ngày đặt</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Trạng thái</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Giá</th>
              </tr>
            </thead>
            <tbody>
              ${
                servicesList ||
                '<tr><td colspan="5" style="padding: 10px; text-align: center;">Không có dữ liệu</td></tr>'
              }
            </tbody>
            <tfoot>
              <tr style="background-color: #f9f9f9;">
                <td colspan="4" style="padding: 10px; font-weight: bold; border-top: 2px solid #ddd;">Tổng cộng</td>
                <td style="padding: 10px; font-weight: bold; border-top: 2px solid #ddd;">${new Intl.NumberFormat(
                  'vi-VN',
                  { style: 'currency', currency: 'VND' }
                ).format(totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div style="background-color: #f0f7ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4a90e2;">
          <h3 style="color: #4a90e2; margin-top: 0;">Hướng dẫn chuẩn bị</h3>
          <p>Để đảm bảo kết quả xét nghiệm chính xác nhất, vui lòng làm theo các hướng dẫn sau:</p>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            ${preparationGuidelines || '<li>Không có hướng dẫn đặc biệt</li>'}
          </ul>
        </div>
        
        <div style="background-color: #fff8e1; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #FFC107;">
          <h3 style="color: #FFC107; margin-top: 0;">Lưu ý quan trọng</h3>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li style="margin-bottom: 5px;">Vui lòng đến đúng giờ hẹn để được phục vụ tốt nhất</li>
            <li style="margin-bottom: 5px;">Mang theo CMND/CCCD và thẻ BHYT (nếu có)</li>
            <li style="margin-bottom: 5px;">Đối với các dịch vụ xét nghiệm, vui lòng tuân thủ nghiêm ngặt các hướng dẫn chuẩn bị</li>
            <li style="margin-bottom: 5px;">Nếu bạn cần thay đổi lịch hẹn, vui lòng liên hệ với chúng tôi trước ít nhất 24 giờ</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="http://localhost:5173/services" style="background-color: #4a90e2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Xem chi tiết dịch vụ
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #555;">
          <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:</p>
          <p>Email: support@gencare.vn | Hotline: 0907865147</p>
        </div>
        
        <div style="margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
          <p style="margin: 0;">Trân trọng,</p>
          <p style="margin: 5px 0 0;"><strong>Đội ngũ GenCare</strong></p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"GenCare" <${env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: 'Thông tin dịch vụ y tế của bạn tại GenCare',
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    return {
      status: 'success',
      message: 'Email thông báo đặt dịch vụ thành công đã được gửi',
      sentTo: user.email,
    };
  } catch (error) {
    console.error('Error sending service summary email:', error);
    return {
      status: 'error',
      message: `Lỗi khi gửi email: ${error.message}`,
    };
  }
};

const sendOrderCancellationEmail = async (
  order_id,
  user_id,
  reason = 'Theo yêu cầu của khách hàng'
) => {
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

    const user = await MODELS.UserModel.findOne({
      where: { user_id },
      attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone'],
    });

    if (!user) {
      return {
        status: 'error',
        message: `Không tìm thấy người dùng với ID: ${user_id}`,
      };
    }

    const order = await MODELS.OrderModel.findOne({
      where: { order_id },
    });

    if (!order) {
      return {
        status: 'error',
        message: `Không tìm thấy đơn hàng với ID: ${order_id}`,
      };
    }

    const orderDetails = await MODELS.OrderDetailModel.findAll({
      where: { order_id },
      include: [
        {
          model: MODELS.ServiceTestModel,
          as: 'service',
          attributes: ['service_id', 'name', 'price', 'description'],
        },
      ],
    });

    let totalAmount = 0;
    const servicesList = orderDetails
      .map((detail) => {
        const price = detail.service?.price
          ? parseFloat(detail.service.price)
          : 0;
        totalAmount += price;

        return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${
            detail.service?.name || 'Dịch vụ'
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
            ${new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(price)}
          </td>
        </tr>
      `;
      })
      .join('');

    const orderDate = new Date(order.created_at).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const cancellationDate = new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #e74c3c; text-align: center;">Thông báo hủy đơn hàng</h2>
        </div>
        
        <p>Xin chào <strong>${user?.first_name || ''} ${
      user?.last_name || ''
    }</strong>,</p>
        
        <p>Chúng tôi xác nhận rằng đơn hàng của bạn đã được hủy thành công theo yêu cầu.</p>
        
        <div style="background-color: #ffffff; border-radius: 5px; padding: 15px; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h3 style="color: #e74c3c; margin-top: 0;">Chi tiết đơn hàng đã hủy</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 40%;">Mã đơn hàng:</td>
              <td style="padding: 8px 0; font-weight: 500;">${order_id}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Ngày đặt hàng:</td>
              <td style="padding: 8px 0; font-weight: 500;">${orderDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Ngày hủy:</td>
              <td style="padding: 8px 0; font-weight: 500;">${cancellationDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Lý do hủy:</td>
              <td style="padding: 8px 0; font-weight: 500;">${reason}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Trạng thái đơn hàng:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #e74c3c;">Đã hủy</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #fff5f5; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #e74c3c;">
          <h3 style="color: #e74c3c; margin-top: 0;">Dịch vụ đã hủy</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Tên dịch vụ</th>
                <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">Giá</th>
              </tr>
            </thead>
            <tbody>
              ${servicesList}
            </tbody>
            <tfoot>
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 8px; font-weight: bold; border-top: 2px solid #ddd;">Tổng cộng</td>
                <td style="padding: 8px; font-weight: bold; border-top: 2px solid #ddd; text-align: right;">
                  ${new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        ${
          order.payment_method && order.order_status === 'paid'
            ? `<div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #2ecc71;">
          <h3 style="color: #2ecc71; margin-top: 0;">Thông tin hoàn tiền</h3>
          <p>Vì đơn hàng của bạn đã được thanh toán, chúng tôi sẽ tiến hành hoàn tiền trong vòng 5-7 ngày làm việc.</p>
          <p>Số tiền hoàn lại: <strong>${new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(totalAmount)}</strong></p>
          <p>Phương thức hoàn tiền: Chuyển khoản về tài khoản gốc</p>
        </div>`
            : ''
        }
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #6c757d;">
          <h3 style="color: #6c757d; margin-top: 0;">Thông tin bổ sung</h3>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li style="margin-bottom: 5px;">Nếu bạn muốn đặt lại dịch vụ, vui lòng truy cập trang web hoặc ứng dụng của chúng tôi.</li>
            <li style="margin-bottom: 5px;">Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với đội ngũ hỗ trợ khách hàng.</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="http://localhost:5173/services" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Đặt dịch vụ khác
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #555;">
          <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:</p>
          <p>Email: support@gencare.vn | Hotline: 0907865147</p>
        </div>
        
        <div style="margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
          <p style="margin: 0;">Trân trọng,</p>
          <p style="margin: 5px 0 0;"><strong>Đội ngũ GenCare</strong></p>
        </div>
      </div>
    `;

    // Gửi email
    const mailOptions = {
      from: `"GenCare" <${env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: `Xác nhận hủy đơn hàng - Mã đơn: ${order_id}`,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    return {
      status: 'success',
      message: 'Email thông báo hủy đơn hàng đã được gửi',
      sentTo: user.email,
    };
  } catch (error) {
    console.error('Error sending order cancellation email:', error);
    return {
      status: 'error',
      message: `Lỗi khi gửi email: ${error.message}`,
    };
  }
};

const sendAppointmentCancellationEmail = async (
  appointment_id,
  reason = 'Theo yêu cầu của khách hàng'
) => {
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

    const appointment = await MODELS.AppointmentModel.findByPk(appointment_id);
    if (!appointment) {
      return {
        status: 'error',
        message: `Không tìm thấy cuộc hẹn với ID: ${appointment_id}`,
      };
    }

    const user = await MODELS.UserModel.findByPk(appointment.user_id);
    if (!user) {
      return {
        status: 'error',
        message: `Không tìm thấy người dùng với ID: ${appointment.user_id}`,
      };
    }

    const doctor = await MODELS.DoctorModel.findByPk(appointment.doctor_id);

    let appointmentDate = 'Không xác định';
    const availability = await MODELS.AvailabilityModel.findOne({
      where: { avail_id: appointment_id.replace('AP', 'AV') },
    });

    if (availability && availability.date) {
      const dateParts = availability.date.toString().split('-');
      if (dateParts.length === 3) {
        appointmentDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      }
    }

    const timeslot = await MODELS.TimeslotModel.findByPk(
      appointment.timeslot_id
    );

    let appointmentTime = 'Không xác định';
    if (timeslot && timeslot.time_start && timeslot.time_end) {
      const startTime = timeslot.time_start.substring(0, 5) || '';
      const endTime = timeslot.time_end.substring(0, 5) || '';
      if (startTime && endTime) {
        appointmentTime = `${startTime} - ${endTime}`;
      }
    }

    const cancellationDate = new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #e74c3c; text-align: center;">Xác nhận hủy cuộc hẹn và hoàn tiền thành công</h2>
        </div>
        
        <p>Xin chào <strong>${user?.first_name || ''} ${
      user?.last_name || ''
    }</strong>,</p>
        
        <p>Chúng tôi xác nhận rằng cuộc hẹn của bạn đã được hủy thành công và chúng tôi đã hoàn tiền cho bạn (nếu có).</p>
        
        <div style="background-color: #ffffff; border-radius: 5px; padding: 15px; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h3 style="color: #e74c3c; margin-top: 0;">Chi tiết cuộc hẹn đã hủy</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 40%;">Mã cuộc hẹn:</td>
              <td style="padding: 8px 0; font-weight: 500;">${appointment_id}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Bác sĩ:</td>
              <td style="padding: 8px 0; font-weight: 500;">${
                doctor
                  ? `${doctor.last_name} ${doctor.first_name || ''}`.trim()
                  : 'Không xác định'
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Loại tư vấn:</td>
              <td style="padding: 8px 0; font-weight: 500;">${
                appointment.consultant_type || 'Tư vấn chung'
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Ngày hẹn:</td>
              <td style="padding: 8px 0; font-weight: 500;">${appointmentDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Thời gian:</td>
              <td style="padding: 8px 0; font-weight: 500;">${appointmentTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Ngày hủy:</td>
              <td style="padding: 8px 0; font-weight: 500;">${cancellationDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Lý do hủy:</td>
              <td style="padding: 8px 0; font-weight: 500;">${reason}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Chi phí tư vấn:</td>
              <td style="padding: 8px 0; font-weight: 500;">${new Intl.NumberFormat(
                'vi-VN',
                { style: 'currency', currency: 'VND' }
              ).format(appointment.price_apm || 0)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Trạng thái cuộc hẹn:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #e74c3c;">Đã hủy</td>
            </tr>
          </table>
        </div>
        
        ${
          appointment.is_paid
            ? `<div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #2ecc71;">
      <h3 style="color: #2ecc71; margin-top: 0;">Xác nhận đã hoàn tiền</h3>
      <p>Chúng tôi đã hoàn tiền thành công cho cuộc hẹn đã hủy của bạn.</p>
      <p>Số tiền đã hoàn lại: <strong>${new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(appointment.price_apm || 0)}</strong></p>
      <p>Phương thức hoàn tiền: Chuyển khoản về tài khoản gốc</p>
      <p>Tiền hoàn trả sẽ được ghi có vào tài khoản của bạn trong vòng 24 giờ tới.</p>
    </div>`
            : ''
        }
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #6c757d;">
          <h3 style="color: #6c757d; margin-top: 0;">Thông tin bổ sung</h3>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li style="margin-bottom: 5px;">Nếu bạn muốn đặt lại cuộc hẹn mới, vui lòng truy cập trang web của chúng tôi.</li>
            <li style="margin-bottom: 5px;">Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với đội ngũ hỗ trợ khách hàng.</li>
          </ul>
        </div>
      
        
        <div style="text-align: center; margin-top: 20px; color: #555;">
          <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:</p>
          <p>Email: support@gencare.vn | Hotline: 0907865147</p>
        </div>
        
        <div style="margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
          <p style="margin: 0;">Trân trọng,</p>
          <p style="margin: 5px 0 0;"><strong>Đội ngũ GenCare</strong></p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"GenCare" <${env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: `Xác nhận đã hủy cuộc hẹn và hoàn tiền thành công - Mã: ${appointment_id}`,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    return {
      status: 'success',
      message: 'Email thông báo hủy cuộc hẹn và hoàn tiền đã được gửi',
      sentTo: user.email,
    };
  } catch (error) {
    console.error('Error sending appointment cancellation email:', error);
    return {
      status: 'error',
      message: `Lỗi khi gửi email: ${error.message}`,
    };
  }
};

const sendBookingServiceSuccessEmail = async (user_id, order_id) => {
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

    const user = await MODELS.UserModel.findOne({
      where: { user_id },
      attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone'],
    });

    if (!user) {
      return {
        status: 'error',
        message: `Không tìm thấy người dùng với ID: ${user_id}`,
      };
    }

    const order = await MODELS.OrderModel.findOne({
      where: { order_id, user_id },
    });

    if (!order) {
      return {
        status: 'error',
        message: `Không tìm thấy đơn hàng với ID: ${order_id} cho người dùng: ${user_id}`,
      };
    }

    const orderDetails = await MODELS.OrderDetailModel.findAll({
      where: { order_id },
      include: [
        {
          model: MODELS.ServiceTestModel,
          as: 'service',
          attributes: [
            'service_id',
            'name',
            'price',
            'description',
            'preparation_guidelines',
          ],
        },
      ],
    });

    if (!orderDetails || orderDetails.length === 0) {
      return {
        status: 'error',
        message: `Không tìm thấy chi tiết đơn hàng cho đơn hàng: ${order_id}`,
      };
    }

    let totalAmount = 0;
    const servicesList = orderDetails
      .map((detail) => {
        if (detail.service?.price) {
          const price = parseFloat(detail.service.price) || 0;
          totalAmount += price;
        }

        const orderDate = new Date(order.created_at).toLocaleDateString(
          'vi-VN',
          {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }
        );

        const paymentStatus =
          order.order_status === 'pending'
            ? '<span style="color: #4CAF50;">Đặt lịch thành công</span>'
            : '<span style="color: #4CAF50;">Đặt lịch thành công</span>';
        // #FFC107
        return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${
            detail.service?.name || 'Dịch vụ'
          }</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${order_id}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${orderDate}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${paymentStatus}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Intl.NumberFormat(
            'vi-VN',
            { style: 'currency', currency: 'VND' }
          ).format(detail.service?.price || 0)}</td>
        </tr>
      `;
      })
      .join('');

    const uniqueGuidelines = [
      ...new Set(
        orderDetails
          .filter((detail) => detail.service?.preparation_guidelines)
          .map((detail) => detail.service.preparation_guidelines)
      ),
    ];

    const preparationGuidelines = uniqueGuidelines
      .map((guideline) => `<li style="margin-bottom: 8px;">${guideline}</li>`)
      .join('');

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #4a90e2; text-align: center;">Xác nhận đặt dịch vụ thành công</h2>
        </div>
        
        <p>Xin chào <strong>${user?.first_name || ''} ${
      user?.last_name || ''
    }</strong>,</p>
        
        <p>Cảm ơn bạn đã đặt dịch vụ tại GenCare! Đơn hàng của bạn đã được xác nhận thành công.</p>
        
        <div style="background-color: #ffffff; border-radius: 5px; padding: 15px; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h3 style="color: #4a90e2; margin-top: 0;">Chi tiết đơn hàng #${order_id}</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Tên dịch vụ</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Mã đơn hàng</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Ngày đặt</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Trạng thái</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Giá</th>
              </tr>
            </thead>
            <tbody>
              ${
                servicesList ||
                '<tr><td colspan="5" style="padding: 10px; text-align: center;">Không có dữ liệu</td></tr>'
              }
            </tbody>
            <tfoot>
              <tr style="background-color: #f9f9f9;">
                <td colspan="4" style="padding: 10px; font-weight: bold; border-top: 2px solid #ddd;">Tổng cộng</td>
                <td style="padding: 10px; font-weight: bold; border-top: 2px solid #ddd;">${new Intl.NumberFormat(
                  'vi-VN',
                  { style: 'currency', currency: 'VND' }
                ).format(totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        ${
          preparationGuidelines
            ? `<div style="background-color: #f0f7ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4a90e2;">
            <h3 style="color: #4a90e2; margin-top: 0;">Hướng dẫn chuẩn bị</h3>
            <p>Để đảm bảo kết quả xét nghiệm chính xác nhất, vui lòng làm theo các hướng dẫn sau:</p>
            <ul style="padding-left: 20px; margin-bottom: 0;">
              ${preparationGuidelines}
            </ul>
          </div>`
            : ''
        }
        
        <div style="background-color: #fff8e1; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #FFC107;">
          <h3 style="color: #FFC107; margin-top: 0;">Lưu ý quan trọng</h3>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li style="margin-bottom: 5px;">Vui lòng đến đúng giờ hẹn để được phục vụ tốt nhất</li>
            <li style="margin-bottom: 5px;">Mang theo CMND/CCCD và thẻ BHYT (nếu có)</li>
            <li style="margin-bottom: 5px;">Đối với các dịch vụ xét nghiệm, vui lòng tuân thủ nghiêm ngặt các hướng dẫn chuẩn bị</li>
            <li style="margin-bottom: 5px;">Nếu bạn cần thay đổi lịch hẹn, vui lòng liên hệ với chúng tôi trước ít nhất 24 giờ</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="http://localhost:5173/services" style="background-color: #4a90e2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Xem đơn hàng của tôi
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #555;">
          <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:</p>
          <p>Email: support@gencare.vn | Hotline: 0907865147</p>
        </div>
        
        <div style="margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
          <p style="margin: 0;">Trân trọng,</p>
          <p style="margin: 5px 0 0;"><strong>Đội ngũ GenCare</strong></p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"GenCare" <${env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: `Xác nhận đặt dịch vụ thành công - Mã đơn: ${order_id}`,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    return {
      status: 'success',
      message: 'Email thông báo đặt dịch vụ thành công đã được gửi',
      sentTo: user.email,
    };
  } catch (error) {
    console.error('Error sending booking service success email:', error);
    return {
      status: 'error',
      message: `Lỗi khi gửi email: ${error.message}`,
    };
  }
};

export const emailService = {
  sendEmail,
  sendPaymentReminderEmail,
  sendBookingConfirmationEmail,
  sendAppointmentFeedbackEmail,
  sendEmailForgetPassword,
  // sendUserServicesSummaryEmail,
  sendBookingServiceSuccessEmail,
  sendOrderCancellationEmail,
  sendAppointmentCancellationEmail,
};
