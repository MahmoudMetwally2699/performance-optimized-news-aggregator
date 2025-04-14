import { NextResponse } from 'next/server';
import { connectDB } from '../../lib/db';
import { Article } from '../../models/Article';
import { fetchFullContent } from '../../lib/articleParser';

export async function POST(request: Request) {
  try {
    const article = await request.json();
    await connectDB();

    // Fetch full content
    const fullContent = await fetchFullContent(article.url);

    const savedArticle = await Article.findOneAndUpdate(
      { url: article.url },
      {
        ...article,
        content: fullContent || article.description,
        publishedAt: new Date(article.publishedAt)
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ id: savedArticle._id });
  } catch (error) {
    console.error('Failed to save article:', error);
    return NextResponse.json({ error: 'Failed to save article' }, { status: 500 });
  }
}
