import util from 'util';
import crypto from 'crypto';
import error from '@error';

const randomBytes: Function = util.promisify(crypto.randomBytes);
const pbkdf2: Function = util.promisify(crypto.pbkdf2);

async function create(
  password: string,
  customKey: string = '',
): Promise<Record<string, any> | void> {
  const buf: string = customKey
    ? customKey
    : (await randomBytes(64)).toString('base64');
  const key: string = (
    await pbkdf2(password, buf, 100000, 64, 'sha512')
  ).toString('base64');

  if (process.env.EXAMINE_PASSWORD) {
    const testKey: string = (
      await pbkdf2(password, buf, 100000, 64, 'sha512')
    ).toString('base64');
    if (testKey !== key) {
      return error.password.encryption();
    }
  }

  return { password: key, enckey: buf };
}
/**
 * @description Verifies Password
 * @param {string} encryptedPassword Password that been hashed
 * @param {string} password Plain password
 * @param {string} enckey Salt of Hashing
 * @returns {boolean} Return if password is correct
 */
async function verify(
  encryptedPassword: string,
  password: string,
  enckey: string,
): Promise<boolean> {
  const key: string = (
    await pbkdf2(password, enckey, 100000, 64, 'sha512')
  ).toString('base64');
  if (key === encryptedPassword) {
    return true;
  }
  return false;
}

export default { create, verify };
