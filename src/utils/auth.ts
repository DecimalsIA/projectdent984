import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const secretKey = process.env.AUTH_SECRET_KEY || 'another-secret-key';
const salt = process.env.AUTH_SALT || 'your-salt-value';

export function generateAuthToken(payload: object): string {
  const randomValue = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(randomValue, salt, 1000, 64, 'sha512').toString('hex');

  const tokenPayload = {
    ...payload,
    randomValue,
    hash,
  };

  const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '1h' });
  return token;
}

export function verifyAuthToken(token: string): object | null {
  try {
    const decoded = jwt.verify(token, secretKey) as { randomValue: string, hash: string };

    const { randomValue, hash } = decoded;
    const verifyHash = crypto.pbkdf2Sync(randomValue, salt, 1000, 64, 'sha512').toString('hex');

    if (hash !== verifyHash) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.log('Error during token verification:', error);
    return null;
  }
}
