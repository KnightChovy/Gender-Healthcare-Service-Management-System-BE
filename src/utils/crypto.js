//chuẩn bị hàm mã hóa 1 nội dung nào đó theo mã sha256
import { createHash } from 'crypto'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()
export function sha256(content) {
  return createHash('sha256').update(content).digest('hex')
}

//viết hàm hashPassword

const SALT_ROUNDS = 10

export const hashPassword = (password) => {
  return bcrypt.hashSync(password, SALT_ROUNDS)
}

export const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword)
}