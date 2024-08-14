import { swapBeeParts } from '@/utils/swapParts';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  const { beeId, newPartIds, userId } = await request.json();

  try {
    const updatedBee = await swapBeeParts(beeId, newPartIds, userId);

    if (!updatedBee) {
      return NextResponse.json({ error: 'Bee not found' }, { status: 404 });
    }

    return NextResponse.json({ beeId: updatedBee.id, newType: updatedBee.type });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
