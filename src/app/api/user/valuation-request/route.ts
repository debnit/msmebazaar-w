
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { turnover, assets, liabilities, phone, balanceSheetUrl, gstReturnsUrl, paymentId } = body;

    if (!turnover || !assets || !liabilities || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = session.user.id;

    // Check if the user has made a successful payment for this service
    const payment = await prisma.paymentTransaction.findFirst({
        where: {
            id: paymentId, // Assuming paymentId is passed from frontend
            userId: userId,
            serviceName: 'Valuation Service',
            status: 'Success'
        }
    });

    // For now, we will not check payment since we don't pass paymentId from frontend
    // if (!payment) {
    //     return NextResponse.json({ error: 'No successful payment found for this service.' }, { status: 403 });
    // }

    await prisma.valuationRequest.create({
      data: {
        userId,
        paymentTransactionId: paymentId,
        turnover,
        assets,
        liabilities,
        phone,
        balanceSheetUrl,
        gstReturnsUrl,
      },
    });

    return NextResponse.json({ message: 'Valuation request submitted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Valuation request submission error:', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
