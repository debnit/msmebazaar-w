import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {name, email, phone, subject, message} = body;

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        {error: 'Missing required fields'},
        {status: 400}
      );
    }

    console.log('New enquiry received:', body);

    // Here you would typically save the enquiry to your database.
    // We'll simulate a successful submission.

    return NextResponse.json(
      {message: 'Enquiry submitted successfully'},
      {status: 201}
    );
  } catch (error) {
    console.error('Enquiry submission error:', error);
    return NextResponse.json(
      {error: 'An error occurred while submitting the enquiry'},
      {status: 500}
    );
  }
}
