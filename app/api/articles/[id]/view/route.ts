import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db';
import { Article } from '../../../../models/Article';
import { getSession } from '../../../../lib/auth';
import mongoose from 'mongoose';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 });
    }

    const session = await getSession();
    if (!session?.id || typeof session.id !== 'string') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const article = await Article.findById(id);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    try {
      await article.addView(session.id);
      return NextResponse.json({ success: true });
    } catch (viewError) {
      console.error('View tracking error:', viewError);
      return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
    }
  } catch (error) {
    console.error('Route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
