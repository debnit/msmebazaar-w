import {NextRequest, NextResponse} from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();
    const {name, email, phone, subject, message} = body;

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        {error: 'Missing required fields'},
        {status: 400}
      );
    }

    const enquiryData: any = {
      name,
      email,
      phone,
      subject,
      message,
    };

    if (session?.user?.id) {
      enquiryData.userId = session.user.id;
    }

    await prisma.enquiry.create({
      data: enquiryData,
    });

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
