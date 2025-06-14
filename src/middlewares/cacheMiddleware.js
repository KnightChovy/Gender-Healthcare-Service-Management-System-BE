import { redisClient } from '../config/redis.js';
import { env } from '../config/environment.js';

/**
 * Middleware để lấy dữ liệu từ cache hoặc chuyển đến controller
 * @param {string} keyPrefix - Tiền tố key để lưu trong Redis
 * @param {number} ttl - Thời gian cache tồn tại (giây)
 */
export const cacheMiddleware = (keyPrefix, ttl = env.REDIS_TTL || 3600) => {
  return async (req, res, next) => {
    if (!redisClient.isOpen) {
      console.log('Redis không kết nối, bỏ qua cache');
      return next();
    }

    try {
      //key dựa trên prefix, params và query
      let uniqueIdentifier = req.params.id || 'all';

      if (keyPrefix === 'profile' && req.user) {
        uniqueIdentifier = req.user.user_id;
      }

      const cacheKey = `${keyPrefix}:${uniqueIdentifier}:${JSON.stringify(
        req.query
      )}`;

      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        console.log(`Cache hit: ${cacheKey}`);
        return res.json(JSON.parse(cachedData));
      }

      console.log(`Cache miss: ${cacheKey}`);

      // Lưu lại hàm json gốc
      const originalJson = res.json;

      // Ghi đè hàm json để lưu cache
      res.json = function (data) {
        // Nếu không phải response thành công, không lưu cache
        if (!data || !data.success) {
          return originalJson.call(this, data);
        }

        redisClient
          .setEx(cacheKey, ttl, JSON.stringify(data))
          .catch((err) => console.error('Redis cache error:', err));

        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Hàm xóa cache
 * @param {string} pattern - Pattern key cần xóa (hỗ trợ *)
 */
export const clearCache = async (pattern) => {
  if (!redisClient.isOpen) {
    console.log('Redis không kết nối, không thể xóa cache');
    return;
  }

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`Đã xóa ${keys.length} keys khớp với pattern: ${pattern}`);
    }
  } catch (error) {
    console.error('Lỗi xóa cache:', error);
  }
};
