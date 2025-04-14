import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/auth';
import { redis } from '@/app/lib/redis';
import { fetchNews } from '@/app/lib/news-service';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const interests = await redis.zrange(`user:${session.id}:interests`, 0, -1);
  const category = interests[0] || 'general';

  const news = await fetchNews({ category });
  return NextResponse.json(news);
}
