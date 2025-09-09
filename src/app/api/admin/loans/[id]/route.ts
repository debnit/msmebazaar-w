
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const updatedLoan = await prisma.loanApplication.update({
      where: { id },
      data: { status },
    });

    // We need to return the userId so the frontend can create a notification
    const headers = new Headers();
    headers.set('X-User-Id', updatedLoan.userId);

    return NextResponse.json(updatedLoan, { status: 200, headers });
  } catch (error) {
    console.error('Failed to update loan status:', error);
    return NextResponse.json(
      { error: 'Failed to update loan status' },
      { status: 500 }
    );
  }
}
