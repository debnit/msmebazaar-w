import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('New loan application received:', body);

    // Basic validation
    if (
      !body.fullName ||
      !body.email ||
      !body.phone ||
      !body.pan ||
      !body.businessName ||
      !body.businessType ||
      !body.loanAmount ||
      !body.loanPurpose
    ) {
      return NextResponse.json(
        {error: 'Missing required fields'},
        {status: 400}
      );
    }

    // In a real application, save the loan application to the database.
    // For now, we simulate success.

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
