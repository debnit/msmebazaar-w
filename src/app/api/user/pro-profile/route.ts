
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
    const { businessName, businessNature, helpNeeded, consultationNotes } = body;

    if (!businessName || !businessNature || !helpNeeded || !consultationNotes) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = session.user.id;

    await prisma.proMemberProfile.upsert({
      where: { userId },
      update: {
        businessName,
        businessNature,
        helpNeeded,
        consultationNotes,
      },
      create: {
        userId,
        businessName,
        businessNature,
        helpNeeded,
        consultationNotes,
      },
    });

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Pro member profile update error:', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
