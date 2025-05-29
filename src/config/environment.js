import dotenv from 'dotenv'
dotenv.config()

export const env = {
  MYSQL_DATABASE: process.env.DB_NAME,
  MYSQL_USER: process.env.DB_USER,
  MYSQL_PASSWORD: process.env.DB_PASSWORD,
  MYSQL_HOST: process.env.DB_HOST,
  MYSQL_PORT: process.env.DB_PORT || 3306,
  HOST_NAME: process.env.HOST_NAME,
  PORT: process.env.PORT || 3000
}
