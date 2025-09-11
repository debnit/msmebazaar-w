
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
    const { assetDetails, turnoverDetails, loanDetails, problemDetails, contactDetails, paymentId } = body;

    if (!assetDetails || !turnoverDetails || !loanDetails || !problemDetails || !contactDetails) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = session.user.id;

    await prisma.navArambhRequest.create({
      data: {
        userId,
        paymentTransactionId: paymentId,
        assetDetails,
        turnoverDetails,
        loanDetails,
        problemDetails,
        contactDetails,
      },
    });

    return NextResponse.json({ message: 'NavArambh request submitted successfully' }, { status: 200 });

  } catch (error) {
    console.error('NavArambh request submission error:', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
