
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
    const { requestType, machineryDetails, name, phone, details, paymentId } = body;

    if (!requestType || !machineryDetails || !name || !phone || !details) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = session.user.id;

    await prisma.plantAndMachineryRequest.create({
      data: {
        userId,
        paymentTransactionId: paymentId,
        requestType,
        machineryDetails,
        name,
        phone,
        details,
      },
    });

    return NextResponse.json({ message: 'Plant & Machinery request submitted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Plant & Machinery request submission error:', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
