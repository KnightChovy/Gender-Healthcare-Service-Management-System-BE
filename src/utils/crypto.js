//chuẩn bị hàm mã hóa 1 nội dung nào đó theo mã sha256
import { createHash } from 'crypto'
import dotenv from 'dotenv'

dotenv.config()
function sha256(content) {
  return createHash('sha256').update(content).digest('hex')
}

//viết hàm hashPassword

export function hashPassword(password) {
  return sha256(password + process.env.PASSWORD_SECRET) //nhét thêm chữ ký bí mật là password_secret trong file .env
}