import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get the latest audit for each criterion
    const latestAudits = await prisma.audit.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      distinct: ['criterionId'],
    });

    // Format to match the expected manual_updates structure
    const manual_updates: Record<string, any> = {};
    latestAudits.forEach((audit) => {
      manual_updates[audit.criterionId] = {
        status: audit.status,
        url: audit.url,
        obs: audit.observation,
        updated_at: audit.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({ manual_updates });
  } catch (error) {
    console.error('Database fetch error:', error);
    return NextResponse.json({ manual_updates: {}, error: String(error) }, { status: 500 });
  }
}
