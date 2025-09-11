
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { subMonths, format } from 'date-fns';

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
        select: { id: true, name: true, email: true, createdAt: true, profilePictureUrl: true },
    });

    // Analytics Data
    const sixMonthsAgo = subMonths(new Date(), 6);

    const monthlyRevenue = await prisma.paymentTransaction.groupBy({
        by: ['createdAt'],
        where: {
            status: 'Success',
            createdAt: { gte: sixMonthsAgo },
        },
        _sum: {
            amount: true,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });

    const userSignups = await prisma.user.groupBy({
        by: ['createdAt'],
        where: {
            createdAt: { gte: sixMonthsAgo },
        },
        _count: {
            id: true,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });

    const formatForChart = (data: any[], valueField: string, countField?: string) => {
        const monthlyData: { [key: string]: number } = {};
        data.forEach(item => {
            const month = format(new Date(item.createdAt), 'MMM yyyy');
            if(countField) {
                 monthlyData[month] = (monthlyData[month] || 0) + item._count[countField];
            } else {
                monthlyData[month] = (monthlyData[month] || 0) + item._sum[valueField];
            }
        });
        return Object.entries(monthlyData).map(([label, value]) => ({ label, value }));
    }
    
    return NextResponse.json({
        totalUsers,
        totalEnquiries,
        totalLoans,
        totalRevenue,
        recentLoans,
        recentUsers,
        monthlyRevenue: formatForChart(monthlyRevenue, 'amount'),
        userSignups: formatForChart(userSignups, '', 'id'),
    });

  } catch (error) {
    console.error('Failed to fetch admin dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin dashboard data' },
      { status: 500 }
    );
  }
}
