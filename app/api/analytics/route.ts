import { NextResponse } from 'next/server';
import { connectDB } from '../../lib/db';
import { Analytics } from '../../models/Analytics';
import { getSession } from '../../lib/auth';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.id || typeof session.id !== 'string') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { articleId, action } = await request.json();

    if (!articleId || !action) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if already tracked today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Analytics.findOne({
      userId: new mongoose.Types.ObjectId(session.id),
      articleId: new mongoose.Types.ObjectId(articleId),
      action,
      timestamp: { $gte: today }
    });

    if (!existing) {
      await Analytics.create({
        articleId: new mongoose.Types.ObjectId(articleId),
        userId: new mongoose.Types.ObjectId(session.id),
        action,
        timestamp: new Date()
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
}
