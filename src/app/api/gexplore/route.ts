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

    const { exists, banned } = await getUserStatus(userId) as { exists: boolean, banned?: boolean };
    if (!exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.log('banned', banned)

    if (banned) {
      return NextResponse.json({ error: 'User Banned' }, { status: 200 });
    } else {
      const balanceGame = await getUserWallet(userId);
      if (balanceGame[0].balance > valuePambii) {

        await updateDocument('WALLET', balanceGame[0].id, { id: balanceGame[0].id, balance: balanceGame[0].balance - valuePambii, timeUpdate: new Date(new Date().toISOString()).getTime() });

        const b = await getUserWallet(userId);
        const idWallet = b[0].id;

        const result = calculateResult(mapNumber);
        const payout = calculatePayout(valuePambii, result);

        const balanceWallet = b[0].balance;
        await updateDocument('WALLET', idWallet, { balance: balanceWallet + payout, timeUpdate: new Date(new Date().toISOString()).getTime() });

        const pool = { userId, valuePambii, payout, mapNumber, signature, timestamp: new Date(new Date().toISOString()).getTime() }

        const hash = await hashName(JSON.stringify(pool))

        await createDocument('PoolMaps', { userId, valuePambii, payout, mapNumber, signature, timestamp: new Date(new Date().toISOString()).getTime(), hash });

        return NextResponse.json({
          map: mapNumber,
          valuePambii: valuePambii,
          multiplier: result,
          payout: payout,
          hash
        }, { status: 200 });

      } else {
        return NextResponse.json({ message: 'User not Value', activeWallet: true }, { status: 200 });
      }

    }

  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}


async function hashName(sms: any) {

  // El texto o datos que deseas hashear
  const data = sms;

  // Crea el hash utilizando el algoritmo SHA-256
  const hash = crypto.createHash('sha256');

  // Actualiza el hash con los datos
  hash.update(data);

  // Obtiene el valor hash final en formato hexadecimal
  const hashDigest = hash.digest('hex');
  return hashDigest;
}


async function getUserStatus(id: string): Promise<UserStatus> {

  const user = await getDocumentById(DB, id) as { banned?: boolean };

  if (user) {
    return {
      exists: true,
      banned: user.banned || false
    };
  }
  return { exists: false, banned: false };
}

async function getUserWallet(id: string): Promise<any> {
  const balance = await getDocuments('WALLET', 'userId', id);
  return balance;
}


function secureRandom(): number {
  const buffer = crypto.randomBytes(8);
  // Leer como un entero sin signo de 64 bits en formato little-endian
  const high = buffer.readUInt32LE(4);
  const low = buffer.readUInt32LE(0);
  // Combinar las dos partes en un solo número de 64 bits
  const combined = high * 0x100000000 + low;
  return combined / 0xffffffffffffffff;
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
  const baseValue = valuePambii;
  const multiplierValue = parseFloat(multiplier.slice(1));
  return baseValue * multiplierValue;
}
