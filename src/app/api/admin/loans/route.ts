
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const loans = await prisma.loanApplication.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });
    return NextResponse.json(loans);
  } catch (error) {
    console.error('Failed to fetch loan applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loan applications' },
      { status: 500 }
    );
  }
}
