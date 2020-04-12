import jwt from 'jsonwebtoken';
import util from 'util';
import crypto, { pbkdf2Sync, randomBytes } from 'crypto';
import { Schema } from 'mongoose';

import error from '@error';
import Assets from '@util/Assets';

// function verifyUser(headers: any, id: string = '') {
//   const token = headers['x-access-token'];
//   Assets.checkNull([token]);
//   const userValue = verifyToken(token, id);
//   return userValue;
// }

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

interface PasswordCreateResult {
  password: string;
  enckey: string;
}
function createPassword(
  password: string,
  customKey: string = '',
): PasswordCreateResult {
  const buf: string = customKey
    ? customKey
    : randomBytes(64).toString('base64');
  const key: string = pbkdf2Sync(password, buf, 100000, 64, 'sha512').toString(
    'base64',
  );

  if (process.env.EXAMINE_PASSWORD) {
    const testKey: string = pbkdf2Sync(
      password,
      buf,
      100000,
      64,
      'sha512',
    ).toString('base64');
    if (testKey !== key) {
      throw error.password.encryption();
    }
  }

  return { password: key, enckey: buf };
}

/**
 * @description Verifies Password
 * @param {string} password Plain password
 * @param {string} encryptedPassword Password that been hashed
 * @param {string} enckey Salt of Hashing
 * @returns {boolean} Return if password is correct
 */
function verifyPassword(
  password: string,
  encryptedPassword: string,
  enckey: string,
): boolean {
  const key: string = pbkdf2Sync(
    password,
    enckey,
    100000,
    64,
    'sha512',
  ).toString('base64');
  if (key === encryptedPassword) {
    return true;
  }
  return false;
}

export default {
  token: {
    verify: verifyToken,
    create: {
      manual: createToken,
    },
  },
  user: {
    // verify: verifyUser,
  },
  password: {
    create: createPassword,
    verify: verifyPassword,
  },
};
