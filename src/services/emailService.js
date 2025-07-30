import nodemailer from 'nodemailer';
import { env } from '~/config/environment';
import { MODELS } from '~/models/initModels';
import ApiError from '~/utils/ApiError';

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
        
        <div style="background-color: #f0f7ff; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
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
      meetingLink: 'https://meet.google.com/gzq-fqau-uix',
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
              userData.meetingLink || 'https://meet.google.com/gzq-fqau-uix'
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

const sendOrderCancellationEmail = async (order_id, user_id) => {
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

    // Lấy thông tin người dùng
    const user = await MODELS.UserModel.findOne({
      where: { user_id },
      attributes: ['email', 'first_name', 'last_name'],
    });

    if (!user) {
      return {
        status: 'error',
        message: `Không tìm thấy người dùng với ID: ${user_id}`,
      };
    }

    // Lấy thông tin đơn hàng
    const order = await MODELS.OrderModel.findOne({
      where: { order_id },
      include: [
        {
          model: MODELS.OrderDetailModel,
          as: 'order_details',
          include: [
            {
              model: MODELS.ServiceTestModel,
              as: 'service',
              attributes: ['name', 'price'],
            },
          ],
        },
      ],
    });

    if (!order) {
      return {
        status: 'error',
        message: `Không tìm thấy đơn hàng với ID: ${order_id}`,
      };
    }

    // Tạo danh sách dịch vụ
    const services = order.order_details
      ? order.order_details.map((detail) => ({
          name: detail.service ? detail.service.name : 'Dịch vụ không xác định',
          price: detail.service ? detail.service.price : 0,
        }))
      : [];

    // Tính tổng tiền
    const total_amount = services.reduce(
      (sum, service) => sum + (service.price || 0),
      0
    );

    // Tạo danh sách dịch vụ cho email
    const servicesList = services
      .map(
        (service) =>
          `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
          service.name
        }</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${new Intl.NumberFormat(
          'vi-VN',
          { style: 'currency', currency: 'VND' }
        ).format(service.price)}</td>
      </tr>`
      )
      .join('');

    // Format ngày
    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(today);

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4a90e2;">GenCare</h1>
        </div>
        <h2 style="color: #4a90e2;">Xác nhận hủy đơn hàng</h2>
        <p>Xin chào ${user.first_name} ${user.last_name},</p>
        <p>Chúng tôi xác nhận rằng đơn hàng của bạn đã được hủy thành công.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4a90e2; margin: 20px 0;">
          <h3 style="margin-top: 0;">Chi tiết đơn hàng đã hủy</h3>
          <p><strong>Mã đơn hàng:</strong> ${order_id}</p>
          <p><strong>Ngày hủy:</strong> ${formattedDate}</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 10px; text-align: left;">Dịch vụ</th>
                <th style="padding: 10px; text-align: right;">Giá</th>
              </tr>
            </thead>
            <tbody>
              ${servicesList}
              <tr>
                <td style="padding: 10px; border-top: 2px solid #ddd; font-weight: bold;">Tổng cộng</td>
                <td style="padding: 10px; border-top: 2px solid #ddd; text-align: right; font-weight: bold;">
                  ${new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(total_amount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p>Nếu bạn đã thanh toán cho đơn hàng này, khoản tiền sẽ được hoàn trả theo chính sách của chúng tôi.</p>
        <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
        <p>Trân trọng,<br>Đội ngũ GenCare</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777777;">
          <p>Email này được gửi tự động, vui lòng không trả lời.</p>
          <p>Nếu bạn có câu hỏi, vui lòng liên hệ với chúng tôi qua email support@gencare.vn hoặc số điện thoại 0907865147.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"GenCare" <${env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: `Xác nhận hủy đơn hàng - ${order_id}`,
      html: emailContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email hủy đơn hàng đã được gửi: ', info.messageId);

    return {
      status: 'success',
      message: 'Email xác nhận hủy đơn hàng đã được gửi',
      info: info.messageId,
      sentTo: user.email,
    };
  } catch (error) {
    console.error('Error sending order cancellation email:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi khi gửi email xác nhận hủy đơn hàng',
      error: error.message,
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
              <td style="padding: 8px 0; color: #666; width: 60%;">${appointment_id}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Bác sĩ:</td>
              <td style="padding: 8px 0; color: #666;">${
                doctor
                  ? `${doctor.last_name} ${doctor.first_name || ''}`.trim()
                  : 'Không xác định'
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Loại tư vấn:</td>
              <td style="padding: 8px 0; color: #666;">${
                appointment.consultant_type || 'Tư vấn chung'
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Ngày hẹn:</td>
              <td style="padding: 8px 0; color: #666;">${appointmentDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Thời gian:</td>
              <td style="padding: 8px 0; color: #666;">${appointmentTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Ngày hủy:</td>
              <td style="padding: 8px 0; color: #666;">${cancellationDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Lý do hủy:</td>
              <td style="padding: 8px 0; color: #666;">${reason}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Chi phí tư vấn:</td>
              <td style="padding: 8px 0; color: #666;">${new Intl.NumberFormat(
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

const sendOrderTestCompletionEmail = async (user_id, order_id) => {
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
            'result_wait_time',
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

    const testCompletionDate = new Date();

    const completionDateFormatted = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(testCompletionDate);

    let servicesTableRows = '';
    let maxWaitHours = 0;

    for (const detail of orderDetails) {
      const service = detail.service;
      if (!service) continue;

      const waitTimeHours =
        service.result_wait_time && !isNaN(parseInt(service.result_wait_time))
          ? parseInt(service.result_wait_time)
          : 24;

      if (waitTimeHours > maxWaitHours) {
        maxWaitHours = waitTimeHours;
      }

      const expectedResultDate = new Date(
        testCompletionDate.getTime() + waitTimeHours * 60 * 60 * 1000
      );

      const expectedDateFormatted = new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(expectedResultDate);

      servicesTableRows += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${
            service.name || 'Không có tên'
          }</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${waitTimeHours} giờ</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #4CAF50;"><strong>${expectedDateFormatted}</strong></td>
        </tr>
      `;
    }

    const latestExpectedResultDate = new Date(
      testCompletionDate.getTime() + maxWaitHours * 60 * 60 * 1000
    );

    const latestExpectedDateFormatted = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(latestExpectedResultDate);

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #4a90e2;">Xét nghiệm đã hoàn thành</h2>
        </div>
        
        <p>Xin chào <strong>${user?.first_name || ''} ${
      user?.last_name || ''
    }</strong>,</p>
        
        <p>Chúng tôi xin thông báo rằng các xét nghiệm trong đơn hàng của bạn đã được hoàn thành thành công.</p>
        
        <div style="background-color: #ffffff; border-radius: 5px; padding: 15px; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h3 style="color: #4a90e2; margin-top: 0;">Chi tiết đơn hàng</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 40%;">Mã đơn hàng:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${order_id}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 40%;">Thời gian hoàn thành:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${completionDateFormatted}</td>
            </tr>
          </table>
          
          <h3 style="color: #4a90e2; margin-top: 20px;">Danh sách xét nghiệm và thời gian dự kiến có kết quả</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Tên xét nghiệm</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Thời gian chờ</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Dự kiến có kết quả</th>
              </tr>
            </thead>
            <tbody>
              ${
                servicesTableRows ||
                '<tr><td colspan="3" style="padding: 10px; text-align: center;">Không có dữ liệu</td></tr>'
              }
            </tbody>
          </table>
        </div>
        
        <div style="background-color: #f0f7ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4a90e2;">
          <h3 style="color: #4a90e2; margin-top: 0;">Thông tin quan trọng</h3>
          <p>Kết quả xét nghiệm của bạn đang được xử lý bởi đội ngũ chuyên gia của chúng tôi. Bạn sẽ nhận được thông báo qua email khi kết quả sẵn sàng.</p>
          <p>Dự kiến có kết quả muộn nhất: <strong style="color: #4CAF50;">${latestExpectedDateFormatted}</strong></p>
          <p>Thời gian dự kiến có thể thay đổi tùy thuộc vào tình trạng xét nghiệm và các yếu tố khác.</p>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="http://localhost:5173/services" style="background-color: #4a90e2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Xem chi tiết đơn hàng
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
      subject: `Xét nghiệm đơn hàng #${order_id} đã hoàn thành - Kết quả dự kiến: ${latestExpectedDateFormatted}`,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    return {
      status: 'success',
      message: 'Email thông báo hoàn thành xét nghiệm đã được gửi',
      sentTo: user.email,
      expectedResultDate: latestExpectedDateFormatted,
    };
  } catch (error) {
    console.error('Error sending order test completion email:', error);
    return {
      status: 'error',
      message: `Lỗi khi gửi email: ${error.message}`,
    };
  }
};

const sendCycleNotificationEmail = async (user, cycleData) => {
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

    const today = new Date();

    const lastPeriodDate = new Date(cycleData.lastPeriodDate);
    const cycleLength = cycleData.cycleLength || 28;
    const periodLength = cycleData.periodLength || 5;

    const addDays = (date, days) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    let nextPeriodDate;
    let cycleCount = 1;

    do {
      nextPeriodDate = addDays(lastPeriodDate, cycleLength * cycleCount);
      cycleCount++;
    } while (nextPeriodDate < today);

    // Tính ngày rụng trứng (thường là giữa chu kỳ)
    const ovulationDate = addDays(nextPeriodDate, -Math.floor(cycleLength / 2));

    // Tính thời kỳ màu mỡ (5 ngày trước rụng trứng đến 1 ngày sau)
    const fertilityStartDate = addDays(ovulationDate, -5);
    const fertilityEndDate = addDays(ovulationDate, 1);

    // Tính số ngày còn lại đến chu kỳ tiếp theo
    const daysUntilPeriod = Math.floor(
      (nextPeriodDate - today) / (1000 * 60 * 60 * 24)
    );

    const periodDaysText =
      daysUntilPeriod === 0
        ? 'hôm nay'
        : daysUntilPeriod === 1
        ? 'ngày mai'
        : `trong ${daysUntilPeriod} ngày nữa`;

    const formatVietnameseDate = (date) => {
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        weekday: 'long',
      }).format(date);
    };

    const formattedNextPeriodDate = formatVietnameseDate(nextPeriodDate);
    const formattedOvulationDate = formatVietnameseDate(ovulationDate);
    const formattedFertilityStartDate =
      formatVietnameseDate(fertilityStartDate);
    const formattedFertilityEndDate = formatVietnameseDate(fertilityEndDate);

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #E9407A;">Thông tin chu kỳ kinh nguyệt của bạn</h2>
        </div>
        
        <p>Xin chào <strong>${user?.first_name || ''} ${
      user?.last_name || ''
    }</strong>,</p>
        
        <p>GenCare xin gửi đến bạn thông tin cập nhật về chu kỳ kinh nguyệt sắp tới:</p>
        
        <!-- Phần chu kỳ kinh nguyệt -->
        <div style="background-color: #FFF0F5; border-left: 4px solid #E9407A; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #E9407A; margin-top: 0;">Chu kỳ kinh nguyệt sắp đến</h3>
          <p>Chu kỳ kinh nguyệt tiếp theo của bạn dự kiến sẽ bắt đầu <strong>${periodDaysText}</strong> - <strong>${formattedNextPeriodDate}</strong>.</p>
          <p>Thời gian dự kiến của chu kỳ này: <strong>${periodLength} ngày</strong></p>
          <p>Một số gợi ý để chuẩn bị cho chu kỳ:</p>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li>Chuẩn bị sẵn băng vệ sinh hoặc cốc nguyệt san</li>
            <li>Đảm bảo bạn có thuốc giảm đau nếu thường bị đau bụng kinh</li>
            <li>Uống nhiều nước và duy trì chế độ ăn uống cân bằng</li>
          </ul>
        </div>
        
        <!-- Phần rụng trứng -->
        <div style="background-color: #F0F7FF; border-left: 4px solid #4A90E2; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #4A90E2; margin-top: 0;">Ngày rụng trứng</h3>
          <p>Ngày rụng trứng của bạn dự kiến sẽ là <strong>${formattedOvulationDate}</strong>.</p>
          <p>Đây là thời điểm:</p>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li>Khả năng thụ thai cao nhất nếu bạn đang cố gắng có thai</li>
            <li>Cần đặc biệt chú ý nếu bạn đang tránh thai tự nhiên</li>
            <li>Có thể gặp một số triệu chứng như đau bụng nhẹ, tiết dịch âm đạo trong hơn</li>
          </ul>
        </div>
        
        <!-- Phần thời kỳ màu mỡ -->
        <div style="background-color: #F3E5F5; border-left: 4px solid #7E57C2; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #7E57C2; margin-top: 0;">Thời kỳ màu mỡ</h3>
          <p>Thời kỳ màu mỡ của bạn sẽ bắt đầu từ <strong>${formattedFertilityStartDate}</strong> đến <strong>${formattedFertilityEndDate}</strong>.</p>
          <p>Thời kỳ này là khoảng thời gian khi khả năng thụ thai của bạn cao nhất:</p>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li>Bao gồm 5 ngày trước ngày rụng trứng và 1 ngày sau đó</li>
            <li>Thời gian tốt nhất để thụ thai nếu bạn đang cố gắng có em bé</li>
            <li>Cần đặc biệt cẩn thận nếu bạn không muốn có thai</li>
          </ul>
        </div>
        
        <div style="background-color: #ffffff; border-radius: 5px; padding: 15px; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h3 style="color: #E9407A; margin-top: 0;">Nhật ký chu kỳ</h3>
          <p>Ghi lại các triệu chứng và cảm giác của bạn giúp theo dõi sức khỏe và phát hiện sớm các vấn đề.</p>
          <div style="text-align: center; margin-top: 15px;">
            <a href="http://localhost:5173/menstrual-cycle" style="background-color: #E9407A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Cập nhật nhật ký chu kỳ
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #777;">
          <p>Nếu bạn có bất kỳ câu hỏi nào về sức khỏe phụ khoa, vui lòng liên hệ với đội ngũ GenCare:</p>
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
      subject: 'Thông tin chu kỳ kinh nguyệt sắp tới của bạn',
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    return {
      status: 'success',
      message: 'Email thông báo chu kỳ kinh nguyệt đã được gửi',
      sentTo: user.email,
    };
  } catch (error) {
    console.error('Error sending cycle notification email:', error);
    return {
      status: 'error',
      message: `Lỗi khi gửi email: ${error.message}`,
    };
  }
};

const sendPillReminderEmail = async (user, cycleData) => {
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

    const pillTime = cycleData.pillTime || '08:00';

    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(today);

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #E9407A;">Nhắc nhở uống thuốc tránh thai</h2>
        </div>
        
        <p>Xin chào <strong>${user?.first_name || ''} ${
      user?.last_name || ''
    }</strong>,</p>
        
        <p>GenCare xin gửi đến bạn lời nhắc nhở uống thuốc tránh thai hôm nay.</p>
        
        <div style="background-color: #FFF0F5; border-left: 4px solid #E9407A; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #E9407A; margin-top: 0;">Nhắc nhở uống thuốc</h3>
          <p>Đã đến giờ uống thuốc tránh thai của bạn: <strong>${pillTime}</strong></p>
          <p>Ngày: <strong>${formattedDate}</strong></p>
          <p>Để đảm bảo hiệu quả tránh thai tốt nhất, hãy:</p>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li>Uống thuốc đúng giờ mỗi ngày</li>
            <li>Không bỏ liều hoặc trì hoãn</li>
            <li>Uống thuốc ngay cả khi không có quan hệ tình dục</li>
            <li>Liên hệ với bác sĩ nếu có vấn đề hoặc tác dụng phụ</li>
          </ul>
        </div>
        
        <div style="background-color: #ffffff; border-radius: 5px; padding: 15px; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h3 style="color: #E9407A; margin-top: 0;">Lời khuyên</h3>
          <p>Việc uống thuốc đều đặn hàng ngày rất quan trọng để đảm bảo hiệu quả tránh thai. Bạn có thể thiết lập báo thức hàng ngày trên điện thoại để nhắc nhở thời gian uống thuốc.</p>
          <p>Nếu bạn quên uống thuốc:</p>
          <ul style="padding-left: 20px;">
            <li>Dưới 12 giờ: Uống ngay khi nhớ ra và uống viên tiếp theo vào giờ thông thường</li>
            <li>Trên 12 giờ: Hiệu quả tránh thai có thể giảm, cân nhắc biện pháp bổ sung</li>
            <li>Nếu quên 2 viên trở lên: Liên hệ với bác sĩ để được tư vấn</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #777;">
          <p>Nếu bạn có bất kỳ câu hỏi nào về thuốc tránh thai hoặc sức khỏe sinh sản, vui lòng liên hệ với đội ngũ GenCare:</p>
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
      subject: `Nhắc nhở: Đã đến giờ uống thuốc tránh thai (${pillTime})`,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    return {
      status: 'success',
      message: 'Email nhắc nhở uống thuốc tránh thai đã được gửi',
      sentTo: user.email,
    };
  } catch (error) {
    console.error('Error sending pill reminder email:', error);
    return {
      status: 'error',
      message: `Lỗi khi gửi email: ${error.message}`,
    };
  }
};

const sendPillReminders = async () => {
  try {
    const now = new Date();
    const vietnamHours = (now.getUTCHours() + 7) % 24;
    const vietnamMinutes = now.getUTCMinutes();

    const currentTimeString = `${vietnamHours
      .toString()
      .padStart(2, '0')}:${vietnamMinutes.toString().padStart(2, '0')}`;

    const { cycleService } = require('../services/cycleService');
    const cycles = await cycleService.getAllCycles();

    if (!cycles || cycles.length === 0) {
      return {
        sentCount: 0,
        message: 'Không có dữ liệu chu kỳ nào',
        results: [],
      };
    }

    const matchingCycles = cycles.filter((cycle) => {
      if (!cycle.pillTime) return false;

      const cyclePillTime = cycle.pillTime;
      const [cycleHours, cycleMinutes] = cyclePillTime.split(':').map(Number);
      const [currentHours, currentMinutes] = currentTimeString
        .split(':')
        .map(Number);

      // Tính tổng số phút
      const cycleTimeInMinutes = cycleHours * 60 + cycleMinutes;
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;

      // Cho phép sai lệch 5 phút
      return Math.abs(cycleTimeInMinutes - currentTimeInMinutes) <= 5;
    });

    if (matchingCycles.length === 0) {
      return {
        sentCount: 0,
        message: 'Không có người dùng nào cần nhắc nhở uống thuốc vào lúc này',
        results: [],
      };
    }

    const results = [];

    for (const cycle of matchingCycles) {
      const user = await MODELS.UserModel.findOne({
        where: { user_id: cycle.user_id },
        attributes: ['user_id', 'first_name', 'last_name', 'email'],
      });

      if (user && user.email) {
        const emailResult = await sendPillReminderEmail(user, cycle);

        results.push({
          user_id: user.user_id,
          pillTime: cycle.pillTime,
          result: emailResult,
        });
      }
    }

    return {
      sentCount: results.length,
      message: `Đã gửi ${results.length} email nhắc nhở uống thuốc tránh thai`,
      results,
    };
  } catch (error) {
    console.error('Error in sendPillReminders:', error);
    throw error;
  }
};

const sendTestResultNotificationEmail = async (order_id, user_id) => {
  try {
    // Khởi tạo transporter
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

    // Lấy thông tin người dùng
    const user = await MODELS.UserModel.findOne({
      where: { user_id },
      attributes: ['user_id', 'email', 'first_name', 'last_name'],
    });

    if (!user) {
      return {
        status: 'error',
        message: `Không tìm thấy người dùng với ID: ${user_id}`,
      };
    }

    // Lấy thông tin đơn hàng
    const order = await MODELS.OrderModel.findOne({
      where: { order_id },
    });

    if (!order) {
      return {
        status: 'error',
        message: `Không tìm thấy đơn hàng với ID: ${order_id}`,
      };
    }

    // Kiểm tra xem đã có kết quả chưa
    const orderDetails = await MODELS.OrderDetailModel.findAll({
      where: { order_id },
      include: [
        {
          model: MODELS.ServiceTestModel,
          as: 'service',
          attributes: ['name', 'description'],
        },
      ],
    });

    if (!orderDetails || orderDetails.length === 0) {
      return {
        status: 'error',
        message: `Không tìm thấy chi tiết đơn hàng: ${order_id}`,
      };
    }

    // Lọc các chi tiết đơn hàng có kết quả
    const detailsWithResults = orderDetails.filter(
      (detail) => detail.testresult_id
    );

    if (detailsWithResults.length === 0) {
      return {
        status: 'error',
        message: `Đơn hàng ${order_id} chưa có kết quả xét nghiệm nào`,
      };
    }

    // Tạo danh sách dịch vụ
    const servicesList = orderDetails
      .map((detail) => {
        const serviceName = detail.service
          ? detail.service.name
          : 'Dịch vụ không xác định';
        const hasResult = detail.testresult_id ? 'Đã có kết quả' : 'Đang xử lý';
        return `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${serviceName}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: ${
            detail.testresult_id ? '#4CAF50' : '#FF9800'
          };">
            <strong>${hasResult}</strong>
          </td>
        </tr>`;
      })
      .join('');

    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(today);

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #4CAF50;">Kết quả xét nghiệm của bạn đã sẵn sàng!</h2>
        </div>
        
        <p>Xin chào <strong>${user.first_name} ${user.last_name}</strong>,</p>
        
        <p>Chúng tôi vui mừng thông báo rằng kết quả xét nghiệm cho đơn hàng <strong>${order_id}</strong> của bạn đã có.</p>
        
        <div style="background-color: #ffffff; border-radius: 5px; padding: 15px; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h3 style="color: #4CAF50; margin-top: 0;">Chi tiết dịch vụ xét nghiệm</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Tên dịch vụ</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              ${servicesList}
            </tbody>
          </table>
        </div>
        
        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4CAF50;">
          <h3 style="color: #2e7d32; margin-top: 0;">Thông tin quan trọng</h3>
          <p>Bạn có thể xem kết quả xét nghiệm bằng cách:</p>
          <ol style="padding-left: 20px; margin-bottom: 0;">
            <li>Đăng nhập vào tài khoản của bạn tại GenCare</li>
            <li>Vào mục "Kết quả xét nghiệm" hoặc "Lịch sử đơn hàng"</li>
            <li>Tìm đơn hàng với mã ${order_id}</li>
            <li>Nhấp vào "Xem kết quả"</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="http://localhost:5173/" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Xem kết quả xét nghiệm
          </a>
        </div>
        
        <div style="background-color: #fff8e1; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #FFC107;">
          <h3 style="color: #FF9800; margin-top: 0;">Lưu ý</h3>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li>Vui lòng đọc kỹ tất cả kết quả xét nghiệm</li>
            <li>Nếu có bất kỳ chỉ số bất thường nào, hãy liên hệ với bác sĩ để được tư vấn</li>
            <li>Để hiểu rõ hơn về kết quả xét nghiệm, bạn có thể đặt lịch tư vấn với bác sĩ chuyên khoa</li>
          </ul>
        </div>
        
        <p>Nếu bạn có thắc mắc về kết quả xét nghiệm hoặc cần hỗ trợ thêm, vui lòng liên hệ với đội ngũ chăm sóc khách hàng của chúng tôi.</p>
        
        <div style="text-align: center; margin-top: 20px; color: #555;">
          <p>Ngày: ${formattedDate}</p>
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
      subject: `Kết quả xét nghiệm đã có - Đơn hàng #${order_id}`,
      html: emailContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email thông báo kết quả xét nghiệm đã gửi: ${info.messageId}`);

    return {
      status: 'success',
      message: 'Email thông báo kết quả xét nghiệm đã được gửi',
      info: info.messageId,
      sentTo: user.email,
    };
  } catch (error) {
    console.error('Error sending test result notification email:', error);
    return {
      status: 'error',
      message:
        error.message || 'Lỗi khi gửi email thông báo kết quả xét nghiệm',
      error: error.message,
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
  sendOrderTestCompletionEmail,
  sendCycleNotificationEmail,
  sendPillReminderEmail,
  sendPillReminders,
  sendTestResultNotificationEmail,
};
