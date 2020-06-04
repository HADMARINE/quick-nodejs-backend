import crypto from 'crypto';

function encryptSymmetry(value: string): string {
  if (!process.env.CIPHER_KEY) throw new Error('Could not resolve Cipher key');
  const cipher = crypto.createCipher('aes-256-cbc', process.env.CIPHER_KEY);
  let result = cipher.update(value, 'utf8', 'base64');
  result += cipher.final('base64');
  return result;
}

function decryptSymmetry(value: string): string {
  if (!process.env.CIPHER_KEY) throw new Error('Could not resolve Cipher key');
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.CIPHER_KEY);
  let result = decipher.update(value, 'base64', 'utf8');
  result += decipher.final('utf8');
  return result;
}

export default {
  symmetry: {
    encrypt: encryptSymmetry,
    decrypt: decryptSymmetry,
  },
};
