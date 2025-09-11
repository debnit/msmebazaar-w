
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

    if (!status || !['Completed', 'Failed'].includes(status)) {
      return NextResponse.json(
        { error: 'A valid status is required' },
        { status: 400 }
      );
    }
    
    const existingRequest = await prisma.redemptionRequest.findUnique({ where: { id } });

    if (!existingRequest) {
        return NextResponse.json({ error: 'Request not found.' }, { status: 404 });
    }

    if(existingRequest.status !== 'Pending' && status === 'Failed') {
        return NextResponse.json({ error: 'Cannot mark a completed request as failed.' }, { status: 400 });
    }
    
    // Use a transaction if we are marking a request as failed to refund the user
    if (status === 'Failed' && existingRequest.status === 'Pending') {
        const updatedRequest = await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: existingRequest.userId },
                data: { walletBalance: { increment: existingRequest.amount } }
            });

            return await tx.redemptionRequest.update({
                where: { id },
                data: { status },
            });
        });
        return NextResponse.json(updatedRequest, { status: 200 });

    } else {
        // Just update status for 'Completed'
        const updatedRequest = await prisma.redemptionRequest.update({
            where: { id },
            data: { status },
        });
        return NextResponse.json(updatedRequest, { status: 200 });
    }

  } catch (error) {
    console.error('Failed to update redemption status:', error);
    return NextResponse.json(
      { error: 'Failed to update redemption status' },
      { status: 500 }
    );
  }
}
