import { sendEmailService } from '~/services/emailService';
import { StatusCodes } from 'http-status-codes';

export const sendEmailController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'The email is required',
      });
    }

    console.log(`Attempting to send email to: ${email}`);
    const response = await sendEmailService(email);

    if (response.status === 'error') {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.error('Error in email controller:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Internal server error while sending email',
      error: error.message,
    });
  }
};
