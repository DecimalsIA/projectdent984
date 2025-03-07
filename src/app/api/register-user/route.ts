import { NextRequest, NextResponse } from 'next/server';
import { createUserIfNotExists } from '../../../utils/firebase';
import { UserDocument } from '../../../types/user';


export async function POST(req: NextRequest) {
  try {
    const { idUser, nomTlram, userName, language_code } = await req.json();

    if (!idUser || !nomTlram || !userName || !language_code) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const userData: UserDocument = {
      id: '',
      idUser,
      nomTlram,
      userName,
      language_code,
      registeredAt: new Date().getTime(),
      lastActivity: new Date().getTime(),
      timestamp: new Date().getTime(),
      banned: false,
      exists: true

    };

    const { id, alreadyExists } = await createUserIfNotExists(userData);

    if (alreadyExists) {
      return NextResponse.json({ message: 'User already registered', id });
    } else {
      return NextResponse.json({ message: 'User registered', id });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
}
