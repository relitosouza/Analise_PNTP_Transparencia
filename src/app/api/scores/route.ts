import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const scores = await prisma.transparencyScore.findMany({
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json({ scores });
  } catch (error) {
    console.error('Database fetch error (scores):', error);
    return NextResponse.json({ scores: [], error: String(error) }, { status: 500 });
  }
}
