
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { businessName, businessNature, businessAddress, contactDetails, photosUrl, videosUrl, paymentId } = body;

    if (!businessName || !businessNature || !businessAddress || !contactDetails) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = session.user.id;

    await prisma.advertisement.create({
      data: {
        userId,
        paymentTransactionId: paymentId,
        businessName,
        businessNature,
        businessAddress,
        contactDetails,
        photosUrl,
        videosUrl,
      },
    });
    
    // Trigger notification
    await prisma.notification.create({
        data: {
            userId,
            title: "Advertisement Submitted",
            message: "Your business details have been submitted. Our team will contact you shortly."
        }
    });

    return NextResponse.json({ message: 'Advertisement submitted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Advertisement submission error:', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
