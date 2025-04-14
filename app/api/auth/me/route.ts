import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../../lib/db';
import { User } from '../../../models/User';

function serializeUser(user: any) {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString()
  };
}

export async function GET(request: Request) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    await connectDB();

    const user = await User.findById(decoded.id)
      .select('-password')
      .lean();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Serialize the user object before returning
    const serializedUser = serializeUser(user);
    return NextResponse.json({ user: serializedUser });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
