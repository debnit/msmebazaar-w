
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  // Ensure the logged-in user is an admin
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    const { isAgent } = body;

    if (typeof isAgent !== 'boolean') {
      return NextResponse.json(
        { error: 'isAgent must be a boolean' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isAgent },
    });

    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('Failed to update user agent status:', error);
    return NextResponse.json(
      { error: 'Failed to update user agent status' },
      { status: 500 }
    );
  }
}
