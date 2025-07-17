// import { redisClient } from '../config/redis.js';
// import { env } from '../config/environment.js';

// let isReadOnly = false;

// export const cacheMiddleware = (keyPrefix, ttl = env.REDIS_TTL || 3600) => {
//   return async (req, res, next) => {
//     if (!redisClient.isOpen) {
//       return next();
//     }

//     try {
//       let uniqueIdentifier = req.params.id || 'all';
//       console.log('get doctors', keyPrefix);
//       if (keyPrefix === 'profile' && req.user) {
//         uniqueIdentifier = req.user.user_id;
//       }

//       const cacheKey = `${keyPrefix}:${uniqueIdentifier}:${JSON.stringify(
//         req.query
//       )}`;

//       const cachedData = await redisClient.get(cacheKey);

//       if (cachedData) {
//         console.log(`Cache hit: ${cacheKey}`);
//         return res.json(JSON.parse(cachedData));
//       }

//       console.log(`Cache miss: ${cacheKey}`);

//       const originalJson = res.json;

//       res.json = function (data) {
//         if (!data || !data.success) {
//           return originalJson.call(this, data);
//         }

//         if (!isReadOnly) {
//           redisClient
//             .setEx(cacheKey, ttl, JSON.stringify(data))
//             .catch((err) => {
//               console.error('Redis cache error:', err);
//               if (err.message.includes('READONLY')) {
//                 console.log('Redis is in read-only mode, disabling writes');
//                 isReadOnly = true;
//               }
//             });
//         }

//         return originalJson.call(this, data);
//       };

//       next();
//     } catch (error) {
//       console.error('Cache middleware error:', error);
//       if (error.message.includes('READONLY')) {
//         console.log('Redis is in read-only mode, disabling writes');
//         isReadOnly = true;
//       }
//       next();
//     }
//   };
// };

// export const clearCache = async (pattern) => {
//   if (!redisClient.isOpen || isReadOnly) {
//     console.log(
//       'Redis không kết nối hoặc ở chế độ chỉ đọc, không thể xóa cache'
//     );
//     return;
//   }

//   try {
//     const keys = await redisClient.keys(pattern);
//     if (keys.length > 0) {
//       await redisClient.del(keys);
//       console.log(`Đã xóa ${keys.length} keys khớp với pattern: ${pattern}`);
//     }
//   } catch (error) {
//     console.error('Lỗi xóa cache:', error);
//     if (error.message.includes('READONLY')) {
//       console.log('Redis is in read-only mode, disabling writes');
//       isReadOnly = true;
//     }
//   }
// };

import { redisClient } from '../config/redis.js';
import { env } from '../config/environment.js';

let isReadOnly = false;
// Thêm biến để theo dõi thời gian check lại Redis mode
let lastReadOnlyCheck = 0;
const READ_ONLY_CHECK_INTERVAL = 60000; // 1 phút

// Hàm kiểm tra xem Redis còn ở chế độ read-only không
const checkRedisReadOnlyMode = async () => {
  const now = Date.now();
  if (now - lastReadOnlyCheck < READ_ONLY_CHECK_INTERVAL) {
    return isReadOnly;
  }

  lastReadOnlyCheck = now;

  try {
    // Thử set một giá trị tạm thời để kiểm tra quyền ghi
    await redisClient.set('read_only_check', 'test', { EX: 10 });

    console.log('Redis không còn ở chế độ read-only');
    isReadOnly = false;
    return false;
  } catch (error) {
    if (error.message.includes('READONLY')) {
      isReadOnly = true;
      return true;
    }
    console.error('Lỗi kiểm tra Redis read-only mode:', error);
    return isReadOnly;
  }
};

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

      res.json = async function (data) {
        if (!data || !data.success) {
          return originalJson.call(this, data);
        }

        if (!isReadOnly) {
          try {
            await redisClient.setEx(cacheKey, ttl, JSON.stringify(data));
          } catch (err) {
            console.error('Redis cache error:', err);
            if (err.message.includes('READONLY')) {
              console.log('Redis is in read-only mode, disabling writes');
              isReadOnly = true;

              // Cập nhật thời gian kiểm tra để tránh kiểm tra liên tục khi biết là read-only
              lastReadOnlyCheck = Date.now();
            }
          }
        } else {
          // Định kỳ kiểm tra xem Redis có còn ở chế độ read-only không
          checkRedisReadOnlyMode().catch(console.error);
        }

        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      if (error.message.includes('READONLY')) {
        console.log('Redis is in read-only mode, disabling writes');
        isReadOnly = true;
        lastReadOnlyCheck = Date.now();
      }
      next();
    }
  };
};

export const clearCache = async (pattern) => {
  if (!redisClient.isOpen) {
    console.log('Redis không kết nối, không thể xóa cache');
    return;
  }

  // Kiểm tra lại trạng thái read-only trước khi thử xóa cache
  if (isReadOnly) {
    const stillReadOnly = await checkRedisReadOnlyMode();
    if (stillReadOnly) {
      console.log('Redis vẫn ở chế độ chỉ đọc, không thể xóa cache');
      return;
    }
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
      lastReadOnlyCheck = Date.now();
    }
  }
};
