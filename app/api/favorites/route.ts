import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/auth';
import { redis } from '@/app/lib/redis';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const favorites = await redis.get(`favorites:${session.id}`) || [];
  return NextResponse.json({ favorites });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const article = await request.json();
  const key = `favorites:${session.id}`;
  const favorites = await redis.get(key) || [];

  await redis.set(key, [...favorites, article]);
  return NextResponse.json({ success: true });
}
