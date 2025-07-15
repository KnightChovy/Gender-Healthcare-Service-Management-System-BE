import cron from 'node-cron';
import { emailService } from '../services/emailService.js';

export const schedulePillReminders = () => {
  cron.schedule('*/10 * * * *', async () => {
    try {
      console.log('Đang kiểm tra và gửi nhắc nhở uống thuốc tránh thai...');

      const result = await emailService.sendPillReminders();

      if (result.sentCount > 0) {
        console.log(
          `Đã gửi ${result.sentCount} email nhắc nhở uống thuốc tránh thai`
        );
      }
    } catch (error) {
      console.error('Lỗi khi gửi nhắc nhở uống thuốc tránh thai:', error);
    }
  });

  console.log('Đã lên lịch gửi nhắc nhở uống thuốc tránh thai');
};
