import { NextRequest, NextResponse } from 'next/server';
import { getDocumentById, getDocuments, updateDocument } from '@/utils/firebase';
import * as crypto from 'crypto';

// Definiciones de interfaces y tipos
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, mapNumber, valuePambii } = body;

    if (!userId || mapNumber === undefined) {
      return NextResponse.json({ error: 'userId and mapNumber are required' }, { status: 400 });
    }

    const settings = await getGameSettings();
    const { MAX_CONSECUTIVE_WINS, ADJUSTED_LOSS_PROBABILITY, MAX_TIME_WINDOW_MINUTES } = settings;

    const { exists, banned } = await getUserStatus(userId) as UserStatus;
    if (!exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const result = calculateResult(mapNumber);
    const payout = calculatePayout(valuePambii, result);

    await updateDocument('gameExplore', '', { userId, result, mapNumber, timestamp: new Date().getTime() });

    if (result !== 'x1' && !result.startsWith('x0.')) {
      await updateLeaderboard(userId);
    }

    const userStats = await updateUserStats(userId, payout);

    return NextResponse.json({
      initialValue: mapNumber,
      multiplier: result,
      finalValue: payout,
      totalGamesPlayed: userStats.gamesPlayed,
      totalEarnings: userStats.totalEarnings
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }

  async function getGameSettings(): Promise<GameSettings> {
    const settings = await getDocumentById('gameSettings', 'config');
    if (settings) {
      return settings as GameSettings;
    }
    throw new Error('Game settings not found');
  }

  async function getUserStatus(userId: string): Promise<UserStatus> {
    const user = await getDocumentById('users', userId) as { banned?: boolean };
    if (user) {
      return {
        exists: true,
        banned: user.banned || false
      };
    }
    return { exists: false, banned: false };
  }

  function secureRandom(): number {
    return crypto.randomBytes(4).readUInt32LE() / 0xffffffff;
  }

  async function getUserGameHistory(userId: string, maxTimeWindowMinutes: number): Promise<GameHistory[]> {
    const cutoffDate = new Date(Date.now() - maxTimeWindowMinutes * 60 * 1000);
    const history: GameHistory[] = await getDocuments('gameExplore', 'userId', userId) as GameHistory[];
    return history.filter(game => new Date(game.timestamp) >= cutoffDate);
  }

  async function updateLeaderboard(userId: string) {
    const leaderboardEntry = await getDocumentById('leaderboard', userId) as LeaderboardEntry | null;
    if (leaderboardEntry) {
      await updateDocument('leaderboard', userId, { wins: leaderboardEntry.wins + 1 });
    } else {
      await updateDocument('leaderboard', userId, { userId, wins: 1 });
    }
  }

  function calculateResult(mapNumber: number): string {
    const randomValue = secureRandom();
    if (mapNumber === 1) {
      if (randomValue <= 0.08) return 'x2';
      if (randomValue <= 0.20) return 'x1.5';
      if (randomValue <= 0.45) return 'x1';
      if (randomValue <= 0.70) return 'x0.75';
      if (randomValue <= 0.90) return 'x0.5';
      return 'x0.1';
    } else if (mapNumber === 2) {
      if (randomValue <= 0.03) return 'x4';
      if (randomValue <= 0.13) return 'x2';
      if (randomValue <= 0.28) return 'x1.5';
      if (randomValue <= 0.53) return 'x1';
      if (randomValue <= 0.80) return 'x0.5';
      return 'x0.1';
    } else if (mapNumber === 3) {
      if (randomValue <= 0.01) return 'x10';
      if (randomValue <= 0.06) return 'x5';
      if (randomValue <= 0.18) return 'x2';
      if (randomValue <= 0.40) return 'x1';
      if (randomValue <= 0.70) return 'x0.5';
      return 'x0.1';
    }
    throw new Error('Invalid map number');
  }

  function calculatePayout(valuePambii: number, multiplier: string): number {
    const baseValue = valuePambii;
    const multiplierValue = parseFloat(multiplier.slice(1));
    return baseValue * multiplierValue;
  }

  async function updateUserStats(userId: string, payout: number): Promise<UserStats> {
    let userStats = await getDocumentById('userStats', userId) as UserStats | null;
    if (userStats) {
      userStats.gamesPlayed += 1;
      userStats.totalEarnings += payout;
    } else {
      userStats = {
        gamesPlayed: 1,
        totalEarnings: payout
      };
    }
    await updateDocument('userStats', userId, userStats);
    return userStats;
  }
}
