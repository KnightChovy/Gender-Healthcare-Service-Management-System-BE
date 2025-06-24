import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmailService = async (email) => {
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
