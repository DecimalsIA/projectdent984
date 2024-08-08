import { NextRequest, NextResponse } from 'next/server';
import { createTransaction } from '../../../utils/solana';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const programId = searchParams.get('programId') || 'AceRYkKX6mWc8TtkaCevPhDpjjMBEode75Kn59XtTdVX';
  const baseAccount = searchParams.get('baseAccount') || '9nJwpxx1A7yZeVFp5qBHwg5eDSfMjMDyam3ZDFVxmd4Y';
  const user = searchParams.get('user') || 'EbyUWNGQ8MJPYR8xBqap5J3G4NVJCgQcTuQgzExYqvL3';
  const newValue = parseInt(searchParams.get('newValue') || '42', 10);

  try {
    // Crear la transacción y obtenerla codificada en base58
    const transaction = await createTransaction(programId, baseAccount, user, newValue);
    return NextResponse.json({ transaction });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
