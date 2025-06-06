const { jwtHelper } = require('~/helpers/jwt');
import dotenv from 'dotenv';
import { env } from '~/config/environment';
dotenv.config();

const accessTokenSecret = env.ACCESS_TOKEN_SECRET;

let isAuth = async (req, res, next) => {
  const tokenFromClient =
    req.body.token || req.query.token || req.headers['x-access-token'];
  if (tokenFromClient) {
    try {
      console.log('Token from client:', tokenFromClient);
      const decoded = await jwtHelper.verifyToken(
        tokenFromClient,
        accessTokenSecret
      );
      req.jwtDecoded = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        message: 'Unauthorized.',
      });
    }
  } else {
    return res.status(403).json({
      message: 'No token provided.',
    });
  }
  next();
};

export default isAuth;
