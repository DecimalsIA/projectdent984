import { NextRequest, NextResponse } from 'next/server';
import { createTransaction } from '../../../utils/solana';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const programId = searchParams.get('programId') || 'YOUR_PROGRAM_ID';
  const baseAccount = searchParams.get('baseAccount') || 'BASE_ACCOUNT_PUBLIC_KEY';
  const user = searchParams.get('user') || 'USER_PUBLIC_KEY';
  const newValue = parseInt(searchParams.get('newValue') || '42', 10);

  try {
    const transaction = await createTransaction(programId, baseAccount, user, newValue);
    return NextResponse.json({ transaction });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
