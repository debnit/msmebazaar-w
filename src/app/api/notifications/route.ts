
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // In a real app, you'd want to secure this, e.g., with a secret key
    const body = await req.json();
    const { userId, title, message } = body;

    if (!userId || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
      },
    });

    // Here you would trigger a real-time push to the client
    // (e.g., via WebSockets, or a push service)

    return NextResponse.json(
      { message: 'Notification created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Notification creation error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the notification' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.notification.updateMany({
            where: { 
                userId: session.user.id,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });

        return NextResponse.json({ message: 'Notifications marked as read' }, { status: 200 });

    } catch (error) {
        console.error('Failed to update notifications:', error);
        return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
    }
}
