import { NextRequest, NextResponse } from 'next/server';
import { getDocuments } from '@/utils/firebase';

export async function GET(req: NextRequest) {
  try {

    const leaderboard = await getDocuments('leaderboard', 'wins', 'desc');
    return NextResponse.json({ leaderboard }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard', details: error }, { status: 500 });
  }
}
