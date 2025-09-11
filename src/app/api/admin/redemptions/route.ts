
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';

    const requests = await prisma.redemptionRequest.findMany({
      where: {
        OR: [
          { user: { name: { contains: query, mode: 'insensitive' } } },
          { user: { email: { contains: query, mode: 'insensitive' } } },
          { method: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Failed to fetch redemption requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch redemption requests' },
      { status: 500 }
    );
  }
}
