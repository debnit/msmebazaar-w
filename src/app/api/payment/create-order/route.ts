import {NextRequest, NextResponse} from 'next/server';
import Razorpay from 'razorpay';
import { getSession } from '@/lib/auth';

function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not configured');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {amount, currency = 'INR'} = body;

    if (!amount) {
      return NextResponse.json({error: 'Amount is required'}, {status: 400});
    }

    // Check if Razorpay is configured
    let razorpay;
    try {
      razorpay = getRazorpay();
    } catch (error) {
      return NextResponse.json(
        { error: 'Payment service not configured. Please contact administrator.' },
        { status: 503 }
      );
    }

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(
      {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      {status: 201}
    );
  } catch (error) {
    console.error('Payment order creation error:', error);
    return NextResponse.json(
      {error: 'Failed to create payment order'},
      {status: 500}
    );
  }
}
