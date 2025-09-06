import {NextRequest, NextResponse} from 'next/server';

export async function GET(req: NextRequest) {
  // In a real application, you would verify the user's authentication token.
  // const authorization = req.headers.get('authorization');
  // if (!authorization) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    // Fetch user-specific data from the database.
    // For this prototype, we return mock data.
    const dashboardData = {
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
      enquiries: [
        {
          id: 'ENQ001',
          subject: 'Loan Interest Rates',
          date: '2023-10-26',
          status: 'Answered',
        },
      ],
      loanApplications: [
        {
          id: 'LOAN001',
          amount: '₹5,00,000',
          date: '2023-10-20',
          status: 'Approved',
        },
      ],
      paymentTransactions: [
        {
          id: 'PAY001',
          service: 'Business Registration',
          amount: '₹1,499',
          date: '2023-10-18',
          status: 'Success',
        },
      ],
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
