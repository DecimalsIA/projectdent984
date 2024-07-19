import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getDocuments } from '../../../utils/firebase';
const DB = process.env.NEXT_PUBLIC_FIREBASE_USER_COLLETION || 'USERS';

const secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key';

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ message: 'Missing token' }, { status: 400 });
  }

  // Log the token for debugging
  console.log('Received token:', token);

  try {
    const decoded = jwt.verify(token, secretKey) as { [key: string]: any };

    // Log the decoded token for debugging
    console.log('Decoded token:', decoded);

    const userDoc = await getDocuments(DB, 'idUser', decoded.idUser);

    if (userDoc.length === 0) {
      return NextResponse.json({ message: 'Session not found', active: false, firstTime: true }, { status: 401 });
    }

    const user = userDoc[0] as { idWallet: string };

    if (!user.idWallet) {
      return NextResponse.json({ message: 'Wallet not connected', active: false, firstTime: false }, { status: 401 });
    }

    return NextResponse.json({ session: decoded, active: true, idWallet: user.idWallet });
  } catch (error) {
    console.log('Error during token verification:', error);

    if ((error as Error).name === 'TokenExpiredError') {
      return NextResponse.json({ message: 'Session expired', active: false, firstTime: false }, { status: 403 });
    }
    return NextResponse.json({ message: 'Invalid token', active: false, firstTime: false }, { status: 401 });
  }
}
