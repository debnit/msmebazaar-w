
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { amount, method, details } = await req.json();

    if (!method || !details || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid redemption details provided.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.walletBalance < amount) {
      return NextResponse.json({ error: 'Insufficient wallet balance.' }, { status: 400 });
    }

    // Use a transaction to ensure atomicity
    const redemptionRequest = await prisma.$transaction(async (tx) => {
      // 1. Deduct from wallet
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          walletBalance: {
            decrement: amount,
          },
        },
      });

      // 2. Create redemption request record
      const newRequest = await tx.redemptionRequest.create({
        data: {
          userId: session.user.id,
          amount,
          method,
          details,
          status: 'Pending',
        },
      });

      return newRequest;
    });

    return NextResponse.json({ status: 'success', message: 'Redemption request submitted successfully.', redemptionRequest }, { status: 201 });

  } catch (error) {
    console.error('Redemption request error:', error);
    return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
  }
}
