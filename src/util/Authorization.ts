import jwt from 'jsonwebtoken';
import error from '@error';
import verifyParamNotNull from './verifyParamNotNull';
import Password from '@util/Password';
import { Schema } from 'mongoose';

async function verifyUser(headers: any, id: string = '') {
  const token = headers['x-access-token'];
  verifyParamNotNull([token]);
  const userValue = await verifyToken(token, id);
  return userValue;
}

async function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.TOKEN_KEY || 'tokenkey');
  } catch (err) {
    return error.authorization.tokeninvalid();
  }
}

async function detachUser(userid: string) {}

interface CreateUserTokenPayload {
  userid: string;
  _id: Schema.Types.ObjectId;
}

function createToken(
  payload: CreateUserTokenPayload,
  expireHours: number = 0.5,
): string {
  const jwtSettings: object = {
    expiresIn: Math.floor(expireHours * 3600),
    issuer:
      process.env.NODE_ENV === 'development'
        ? '*'
        : process.env.REQUEST_URI || '*',
  };

  const _payload: CreateUserTokenPayload = {
    userid: payload.userid,
    _id: payload._id,
  };

  const result = jwt.sign(
    _payload,
    process.env.TOKEN_KEY || 'token_key',
    jwtSettings,
  );

  return result;
}

export default {
  token: {
    verify: verifyToken,
    create: createToken,
  },
  user: {
    verify: verifyUser,
  },
};
