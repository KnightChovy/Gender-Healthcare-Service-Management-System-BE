const jwt = require('jsonwebtoken')
// /**
//  * private function generateToken
//  * @param user
//  * @param secretSignature
//  * @param tokenLife
//  */
const generateToken = (user, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    // Định nghĩa những thông tin của user mà bạn muốn lưu vào token ở đây
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email
    }
    // Thực hiện ký và tạo token
    jwt.sign(
      { data: userData },
      secretSignature,
      {
        algorithm: 'HS256',
        expiresIn: tokenLife
      },
      (error, token) => {
        if (error) {
          return reject(error)
        }
        resolve(token)
      })
  })
}
// /**
//  * This module used for verify jwt token
//  * @param {*} token
//  * @param {*} secretKey
//  */
const verifyToken = (token, secretKey) => {
      console.log('verifyToken', token, secretKey)

  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      // Nếu có lỗi trong quá trình xác thực token, trả về lỗic
      if (error) {
        return reject(error)
      }
      resolve(decoded)
    })
  })
}
export const jwtHelper = {
  generateToken,
  verifyToken
}