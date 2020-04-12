import jwt from 'jsonwebtoken';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { Schema } from 'mongoose';

import Session from '@models/Session';

import error from '@error';
import Assets from '@util/Assets';

// function verifyUser(headers: any, id: string = '') {
//   const token = headers['x-access-token'];
//   Assets.checkNull([token]);
//   const userValue = verifyToken(token, id);
//   return userValue;
// }

/**
 * @description Verifies token
 * @param {string} token JWT token
 * @returns {string | object } Return token payload value
 */
function verifyToken(token: string): string | object {
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
}

interface TokenPayload {
  userid: string;
  _id: Schema.Types.ObjectId;
  jwtid: string;
  type: string;
}

/**
 * @description Creates token
 * @param {CreateTokenPayload} payload Token payload {userid, _id, jwtid, type}
 * @param {"access" | "refresh" | string} tokenType Token type (access, refresh, any(string))
 * @param {string | number | null} customExpireTime can define custom expire time
 * @returns {Promise<string>} Return new token
 */
async function createToken(
  payload: CreateTokenPayload,
  tokenType: 'access' | 'refresh' | string,
  customExpireTime: string | number | null = null,
): Promise<string> {
  function expireTime(): string | number {
    if (customExpireTime) return customExpireTime;
    if (tokenType === 'access') return '10min';
    else if (tokenType === 'refresh') return '1d';
    else return '1h';
  }
  try {
    const jwtSettings: jwt.SignOptions = {
      expiresIn: expireTime(),
      issuer:
        process.env.NODE_ENV === 'development'
          ? '*'
          : process.env.REQUEST_URI || '*',
    };

    const _payload: TokenPayload = {
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

    if (tokenType === 'refresh') {
      await new Session().registerToken(result, payload._id);
    }

    return result;
  } catch (e) {
    throw e;
  }
}

interface InitialTokenCreateResult {
  accessToken: string;
  refreshToken: string;
}

/**
 * @description Creates Access, Refresh Token
 * @param {CreateTokenPayload} payload Token payload
 * @returns {Promise<InitialTokenCreateResult>} Returns refresh, access token Object
 */
async function createTokenInitial(
  payload: CreateTokenPayload,
): Promise<InitialTokenCreateResult> {
  const accessToken = await createToken(payload, 'access');
  const refreshToken = await createToken(payload, 'refresh');
  return { accessToken, refreshToken };
}

interface PasswordCreateResult {
  password: string;
  enckey: string;
}

/**
 * @description Creates Password
 * @param {string} password Plain password
 * @param {string} customKey Custom salt key
 * @returns {PasswordCreateResult} Returns password, enckey
 */
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
      initial: createTokenInitial,
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
