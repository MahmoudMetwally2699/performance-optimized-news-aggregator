import { NextResponse } from 'next/server';
import { getNews } from '../../lib/news-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const data = await getNews(Object.fromEntries(searchParams));
    return NextResponse.json(data);
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
