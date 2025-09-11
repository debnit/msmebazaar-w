import {NextRequest, NextResponse} from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, serviceName, amount } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {error: 'Missing payment verification details'},
        {status: 400}
      );
    }

    const text = razorpay_order_id + '|' + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment is successful, save to DB
      const payment = await prisma.paymentTransaction.create({
        data: {
          userId: session.user.id,
          serviceName,
          amount: amount / 100, // Convert from paise to rupees
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: 'Success',
        }
      });
      
      if(serviceName === "Pro-Membership") {
          await prisma.user.update({
              where: { id: session.user.id },
              data: { isPro: true }
          });
      }
      
      return NextResponse.json(
        {status: 'success', message: 'Payment verified successfully', paymentId: payment.id},
        {status: 200}
      );
    } else {
      // Payment failed
      await prisma.paymentTransaction.create({
        data: {
          userId: session.user.id,
          serviceName,
          amount: amount / 100,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: 'Failed',
        }
      });
      return NextResponse.json(
        {status: 'error', message: 'Invalid signature'},
        {status: 400}
      );
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      {status: 'error', message: 'Payment verification failed'},
      {status: 500}
    );
  }
}
