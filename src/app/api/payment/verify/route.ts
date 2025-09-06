import {NextRequest, NextResponse} from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = body;

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
      // In a real application, you would update the payment status in your database
      console.log('Payment verified successfully for order:', razorpay_order_id);
      return NextResponse.json(
        {status: 'success', message: 'Payment verified successfully'},
        {status: 200}
      );
    } else {
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
