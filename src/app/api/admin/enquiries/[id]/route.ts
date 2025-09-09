
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

    const updatedEnquiry = await prisma.enquiry.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedEnquiry, { status: 200 });
  } catch (error) {
    console.error('Failed to update enquiry status:', error);
    return NextResponse.json(
      { error: 'Failed to update enquiry status' },
      { status: 500 }
    );
  }
}
