import {NextRequest, NextResponse} from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const enquiries = await prisma.enquiry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const loanApplications = await prisma.loanApplication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const paymentTransactions = await prisma.paymentTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const dashboardData = {
      user: {
        name: user.name,
        email: user.email,
      },
      enquiries: enquiries.map(e => ({
        id: e.id,
        subject: e.subject,
        date: e.createdAt.toISOString(),
        status: 'Pending', // This could be a field in the model
      })),
      loanApplications: loanApplications.map(l => ({
        id: l.id,
        amount: l.loanAmount.toString(),
        date: l.createdAt.toISOString(),
        status: l.status,
      })),
      paymentTransactions: paymentTransactions.map(p => ({
        id: p.id,
        service: p.serviceName,
        amount: p.amount.toString(),
        date: p.createdAt.toISOString(),
        status: p.status,
      })),
    };

    return NextResponse.json(dashboardData, {status: 200});
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json(
      {error: 'Failed to fetch dashboard data'},
      {status: 500}
    );
  }
}
