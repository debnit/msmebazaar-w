import {NextRequest, NextResponse} from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {amount, currency = 'INR'} = body;

    if (!amount) {
      return NextResponse.json({error: 'Amount is required'}, {status: 400});
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
