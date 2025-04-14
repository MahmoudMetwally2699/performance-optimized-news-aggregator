import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { Article } from '../../../models/Article';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const article = await Article.findById(id).lean();

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Serialize MongoDB document
    const serialized = {
      ...article,
      _id: article._id.toString(),
      views: article.views.map(v => ({
        ...v,
        userId: v.userId.toString(),
        _id: v._id.toString()
      }))
    };

    return NextResponse.json(serialized);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}
