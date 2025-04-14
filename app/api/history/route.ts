import { NextResponse } from 'next/server';
import { connectDB } from '../../lib/db';
import { History } from '../../models/History';
import { getSession } from '../../lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const history = await History.find({ userId: session.id });
  return NextResponse.json({ history });
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return new NextResponse(null, { status: 401 });
    }

    const article = await request.json();
    await connectDB();

    await History.create({
      userId: session.id,
      article
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json(
      { error: 'Failed to save history' },
      { status: 500 }
    );
  }
}
