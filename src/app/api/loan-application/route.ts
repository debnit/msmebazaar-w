import {NextRequest, NextResponse} from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Basic validation
    const {
      fullName, email, phone, pan, businessName, businessType,
      yearsInBusiness, annualTurnover, loanAmount, loanPurpose
    } = body;

    if (
      !fullName || !email || !phone || !pan || !businessName ||
      !businessType || !yearsInBusiness || !annualTurnover ||
      !loanAmount || !loanPurpose
    ) {
      return NextResponse.json(
        {error: 'Missing required fields'},
        {status: 400}
      );
    }

    await prisma.loanApplication.create({
      data: {
        ...body,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {message: 'Loan application submitted successfully'},
      {status: 201}
    );
  } catch (error) {
    console.error('Loan application error:', error);
    return NextResponse.json(
      {error: 'An error occurred while submitting the loan application'},
      {status: 500}
    );
  }
}
