import { getDocumentById, createDocument, updateDocument, getDocuments, getAllDocuments } from '@/utils/firebase';
import * as crypto from 'crypto';
const WIN_RATIO = parseFloat(process.env.WIN_RATIO || '0.4');
interface GameSettings {
  MAX_CONSECUTIVE_WINS: number;
  ADJUSTED_LOSS_PROBABILITY: number;
  MAX_TIME_WINDOW_MINUTES: number;
  pool: number;
}

interface UserStatus {
  exists: boolean;
  banned: boolean;
}

interface UserDocument {
  userId: string;
  banned?: boolean;
  // Otras propiedades del usuario
}

interface GameHistory {
  userId: string;
  result: string;
  timestamp: string;
}

interface UserStats {
  gamesPlayed: number;
  totalEarnings: number;
}

interface LeaderboardEntry {
  wins: number;
}

const DB = process.env.NEXT_PUBLIC_FIREBASE_USER_COLLETION || 'USERS';

export async function processGame(userId: string, mapNumber: number, valuePambii: number, signature: string) {
  try {
    if (!userId || mapNumber === undefined || signature === undefined) {
      throw new Error('FIELDS required');
    }

    const { exists, banned } = await getUserStatus(userId);
    if (!exists) {
      throw new Error('User not found');
    }

    if (banned) {
      return { error: 'User Banned' };
    } else {
      const result = calculateResult(mapNumber);
      const payout = calculatePayout(valuePambii, result);
      const { exp: experience, win, loss } = calculateExperience(result, mapNumber);

      const pool = { userId, valuePambii, payout, mapNumber, signature, timestamp: new Date().getTime(), experience, win, loss, result };

      const hash = await hashName(JSON.stringify(pool));

      await createDocument('PoolMaps', { ...pool, hash });

      return {
        map: mapNumber,
        valuePambii: valuePambii,
        multiplier: result,
        payout: payout,
        experience,
        win,
        loss,
        hash
      };
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function hashName(sms: any): Promise<string> {
  const hash = crypto.createHash('sha256');
  hash.update(sms);
  return hash.digest('hex');
}

async function getUserStatus(userId: string): Promise<UserStatus> {
  const users = await getDocuments(DB, 'idUser', userId);

  if (users && users.length > 0) {
    const user = users[0] as UserDocument;
    return {
      exists: true,
      banned: user.banned || false
    };
  }
  return { exists: false, banned: false };
}

async function getUserWallet(userId: string): Promise<any[]> {
  return await getDocuments('WALLET', 'userId', userId);
}

function secureRandom(): number {
  const buffer = crypto.randomBytes(8);
  const high = buffer.readUInt32LE(4);
  const low = buffer.readUInt32LE(0);
  const combined = high * 0x100000000 + low;
  return combined / 0xffffffffffffffff;
}

function calculateExperience(multiplier: string, mapNumber: number): any {
  let exp = 0;
  let win = 0;
  let loss = 1;
  switch (mapNumber) {
    case 1:
      if (multiplier == 'x2' || multiplier == 'x1.5') {
        exp = 9850;
        win = 1;
      }
      break;
    case 2:
      if (multiplier == 'x4' || multiplier == 'x2') {
        exp = 12500;
        win = 1;
      }
      break;
    case 3:
      if (multiplier == 'x10' || multiplier == 'x5') {
        exp = 18500;
        win = 1;
      }
      break;
    default:
      exp = 0;
      win = 0;
      loss = 1;
      break;
  }
  return { exp, win, loss };
}

function calculateResult(mapNumber: number): string {
  const randomValue = secureRandom();
  const winThreshold = WIN_RATIO; // Variable de entorno para ajustar el porcentaje de ganadores
  const lossThreshold = 1 - winThreshold; // Porcentaje de perdedores

  if (mapNumber === 1) {
    if (randomValue <= winThreshold * 0.3) return 'x2'; // 30% de ganadores
    if (randomValue <= winThreshold * 0.4) return 'x1.5'; // 60% de ganadores
    if (randomValue <= lossThreshold * 0.2) return 'x1';
    if (randomValue <= lossThreshold * 0.4) return 'x0.75';
    if (randomValue <= lossThreshold * 0.8) return 'x0.5';
    return 'x0.7';
  } else if (mapNumber === 2) {
    if (randomValue <= winThreshold * 0.3) return 'x4';
    if (randomValue <= winThreshold * 0.4) return 'x2';
    if (randomValue <= lossThreshold * 0.2) return 'x1.5';
    if (randomValue <= lossThreshold * 0.4) return 'x1';
    if (randomValue <= lossThreshold * 0.8) return 'x0.5';
    return 'x0.7';
  } else if (mapNumber === 3) {
    if (randomValue <= winThreshold * 0.2) return 'x10';
    if (randomValue <= winThreshold * 0.3) return 'x5';
    if (randomValue <= lossThreshold * 0.2) return 'x2';
    if (randomValue <= lossThreshold * 0.4) return 'x1';
    if (randomValue <= lossThreshold * 0.8) return 'x0.5';
    return 'x0.7';
  }
  throw new Error('Invalid map number');
}

function calculatePayout(valuePambii: number, multiplier: string): number {
  return valuePambii * parseFloat(multiplier.slice(1));
}
