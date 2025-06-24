import dotenv from 'dotenv';
dotenv.config();

export const env = {
  MYSQL_DATABASE: process.env.DB_NAME,
  MYSQL_USER: process.env.DB_USER,
  MYSQL_PASSWORD: process.env.DB_PASSWORD,
  MYSQL_HOST: process.env.DB_HOST,
  MYSQL_PORT: process.env.DB_PORT || 3306,
  HOST_NAME: process.env.HOST_NAME,
  PORT: process.env.PORT || 3000,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_TTL: parseInt(process.env.REDIS_TTL),
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
};
