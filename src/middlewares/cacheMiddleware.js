import { redisClient } from '../config/redis.js';
import { env } from '../config/environment.js';

let isReadOnly = false;

export const cacheMiddleware = (keyPrefix, ttl = env.REDIS_TTL || 3600) => {
  return async (req, res, next) => {
    if (!redisClient.isOpen) {
      return next();
    }

    try {
      let uniqueIdentifier = req.params.id || 'all';
      console.log('get doctors', keyPrefix);
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

      const originalJson = res.json;

      res.json = function (data) {
        if (!data || !data.success) {
          return originalJson.call(this, data);
        }

        if (!isReadOnly) {
          redisClient
            .setEx(cacheKey, ttl, JSON.stringify(data))
            .catch((err) => {
              console.error('Redis cache error:', err);
              if (err.message.includes('READONLY')) {
                console.log('Redis is in read-only mode, disabling writes');
                isReadOnly = true;
              }
            });
        }

        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      if (error.message.includes('READONLY')) {
        console.log('Redis is in read-only mode, disabling writes');
        isReadOnly = true;
      }
      next();
    }
  };
};

export const clearCache = async (pattern) => {
  if (!redisClient.isOpen || isReadOnly) {
    console.log(
      'Redis không kết nối hoặc ở chế độ chỉ đọc, không thể xóa cache'
    );
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
    if (error.message.includes('READONLY')) {
      console.log('Redis is in read-only mode, disabling writes');
      isReadOnly = true;
    }
  }
};

