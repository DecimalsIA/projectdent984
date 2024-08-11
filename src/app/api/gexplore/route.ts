
import { NextRequest, NextResponse } from 'next/server';
import { getDocumentById, createDocument, updateDocument, getDocuments, getAllDocuments } from '@/utils/firebase';
import * as crypto from 'crypto';

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, mapNumber, valuePambii, signature } = body;

    if (!userId || mapNumber === undefined || signature === undefined) {
      return NextResponse.json({ error: 'FIELDS required' }, { status: 400 });
    }

    const { exists, banned } = await getUserStatus(userId);
    if (!exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (banned) {
      return NextResponse.json({ error: 'User Banned' }, { status: 200 });
    } else {

      const result = calculateResult(mapNumber);
      const payout = calculatePayout(valuePambii, result);
      const { exp: experience, win, loss } = calculateExperience(result, mapNumber)

      const pool = { userId, valuePambii, payout, mapNumber, signature, timestamp: new Date().getTime(), experience, win, loss }

      const hash = await hashName(JSON.stringify(pool))

      await createDocument('PoolMaps', { ...pool, hash });

      return NextResponse.json({
        map: mapNumber,
        valuePambii: valuePambii,
        multiplier: result,
        payout: payout,
        experience,
        win,
        loss,
        hash
      }, { status: 200 });


    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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

// experience 9,850   12500   18500

// multiplier

function calculateExperience(multiplier: string, mapNumber: number): any {
  let exp = 0;
  let win = 0;
  let loss = 0;
  switch (mapNumber) {
    case 1:
      if (multiplier == 'x2' || multiplier == 'x1.5') {
        exp = 9850;
        win = 1
      }

      break;
    case 2:
      if (multiplier == 'x4' || multiplier == 'x2') {
        exp = 12500;
        win = 1
      }
      break;
    case 3:
      if (multiplier == 'x10' || multiplier == 'x5') {
        exp = 18500;
        win = 1
      }
      break;

    default:
      exp = 0
      win = 0
      loss = 1
      break;
  }
  return { exp, win, loss }
}
function calculateResult(mapNumber: number): string {
  const randomValue = secureRandom();
  if (mapNumber === 1) {
    if (randomValue <= 0.01) return 'x2';
    if (randomValue <= 0.07) return 'x1.5';
    if (randomValue <= 0.20) return 'x1';
    if (randomValue <= 0.30) return 'x0.75';
    if (randomValue <= 0.80) return 'x0.5';
    return 'x0.1';
  } else if (mapNumber === 2) {
    if (randomValue <= 0.005) return 'x4';
    if (randomValue <= 0.07) return 'x2';
    if (randomValue <= 0.12) return 'x1.5';
    if (randomValue <= 0.15) return 'x1';
    if (randomValue <= 0.65) return 'x0.5';
    return 'x0.1';
  } else if (mapNumber === 3) {
    if (randomValue <= 0.001) return 'x10';
    if (randomValue <= 0.01) return 'x5';
    if (randomValue <= 0.05) return 'x2';
    if (randomValue <= 0.10) return 'x1';
    if (randomValue <= 0.50) return 'x0.5';
    return 'x0.1';
  }
  throw new Error('Invalid map number');
}

function calculatePayout(valuePambii: number, multiplier: string): number {
  return valuePambii * parseFloat(multiplier.slice(1));
}
