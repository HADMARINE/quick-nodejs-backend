import jwt from 'jsonwebtoken';
import error from '@error';
import Password from '@util/Password';
import Assets from '@util/Assets';
import { Schema } from 'mongoose';

function verifyUser(headers: any, id: string = '') {
  const token = headers['x-access-token'];
  Assets.checkNull([token]);
  const userValue = verifyToken(token, id);
  return userValue;
}

function verifyToken(token: string): string | object | boolean {
  try {
    return jwt.verify(token, process.env.TOKEN_KEY || 'tokenkey');
  } catch (err) {
    throw error.authorization.tokeninvalid();
  }
}

async function detachUser(userid: string) {}

interface CreateTokenPayload {
  userid: string;
  _id: Schema.Types.ObjectId;
  jwtid: string;
  type: 'access' | 'refresh' | string;
}

function createToken(
  payload: CreateTokenPayload,
  tokenType: 'access' | 'refresh' | string,
  customExpireTime: string | number | null = null,
): string {
  function expireTime(): string | number {
    if (customExpireTime) return customExpireTime;
    if (tokenType === 'access') return '10min';
    else if (tokenType === 'refresh') return '1d';
    else return '1h';
  }

  const jwtSettings: jwt.SignOptions = {
    expiresIn: expireTime(),
    issuer:
      process.env.NODE_ENV === 'development'
        ? '*'
        : process.env.REQUEST_URI || '*',
  };

  const _payload: CreateTokenPayload = {
    userid: payload.userid,
    _id: payload._id,
    jwtid: `${Date.now()}_${payload._id}`,
    type: tokenType,
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
    create: {
      manual: createToken,
    },
  },
  user: {
    verify: verifyUser,
  },
};
