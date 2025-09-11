
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const totalUsers = await prisma.user.count();
    const totalEnquiries = await prisma.enquiry.count();
    const totalLoans = await prisma.loanApplication.count();
    const totalRevenueResult = await prisma.paymentTransaction.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            status: 'Success',
        }
    });
    const totalRevenue = totalRevenueResult._sum.amount ?? 0;


    const recentLoans = await prisma.loanApplication.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
    });

    const recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, createdAt: true },
    });
    
    return NextResponse.json({
        totalUsers,
        totalEnquiries,
        totalLoans,
        totalRevenue,
        recentLoans,
        recentUsers
    });

  } catch (error) {
    console.error('Failed to fetch admin dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin dashboard data' },
      { status: 500 }
    );
  }
}
