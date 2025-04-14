import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createToken } from '../../../lib/auth';
import { connectDB } from '../../../lib/db';
import { User } from '../../../models/User';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    await connectDB();

    const user = await User.create({
      email,
      password, // In production, hash password before saving
      name
    });

    const token = await createToken({
      id: user._id,
      email: user.email,
      name: user.name
    });

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.code === 11000 ? 'Email already exists' : 'Registration failed' },
      { status: 400 }
    );
  }
}
