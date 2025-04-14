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
    const session = await getSession();

    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const article = await Article.findById(id);

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    const isFavorited = article.favorites.includes(new mongoose.Types.ObjectId(String(session.id)));

    if (isFavorited) {
      await article.removeFromFavorites(String(session.id));
    } else {
      await article.addToFavorites(String(session.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update favorite status' },
      { status: 500 }
    );
  }
}
