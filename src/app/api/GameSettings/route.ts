import { updateDocument } from '@/utils/firebase';
import { NextRequest, NextResponse } from 'next/server';

interface GameSettings {
  MAX_CONSECUTIVE_WINS: number;
  ADJUSTED_LOSS_PROBABILITY: number;
  MAX_TIME_WINDOW_MINUTES: number;
  pool: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { MAX_CONSECUTIVE_WINS, ADJUSTED_LOSS_PROBABILITY, MAX_TIME_WINDOW_MINUTES, pool } = body;

    if (
      MAX_CONSECUTIVE_WINS === undefined ||
      ADJUSTED_LOSS_PROBABILITY === undefined ||
      MAX_TIME_WINDOW_MINUTES === undefined ||
      pool === undefined
    ) {
      return NextResponse.json({ error: 'All settings are required' }, { status: 400 });
    }

    const settingsData: GameSettings = {
      MAX_CONSECUTIVE_WINS,
      ADJUSTED_LOSS_PROBABILITY,
      MAX_TIME_WINDOW_MINUTES,
      pool,
    };

    await updateDocument('gameSettings', 'config', settingsData);
    return NextResponse.json({ message: 'Game settings updated successfully' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to update game settings', details: error }, { status: 500 });
  }
}
