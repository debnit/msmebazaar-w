
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { serviceName, amount } = await req.json();

    if (!serviceName || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid service name or amount' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.walletBalance < amount) {
      return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 });
    }

    // Use a transaction to ensure atomicity
    const payment = await prisma.$transaction(async (tx) => {
      // 1. Deduct from wallet & potentially update user status
      const updateData: any = {
          walletBalance: {
            decrement: amount,
          },
      };
      
      await tx.user.update({
        where: { id: session.user.id },
        data: updateData,
      });

      // 2. Create payment transaction record
      const newPayment = await tx.paymentTransaction.create({
        data: {
          userId: session.user.id,
          serviceName,
          amount: amount,
          status: 'Success',
          razorpayPaymentId: `wallet_pay_${Date.now()}`, // Indicate wallet payment
        },
      });

      return newPayment;
    });

    return NextResponse.json({ status: 'success', message: 'Payment successful with wallet balance', paymentId: payment.id }, { status: 200 });

  } catch (error) {
    console.error('Wallet payment error:', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
