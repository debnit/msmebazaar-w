import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {amount, currency = 'INR'} = body;

    if (!amount) {
      return NextResponse.json({error: 'Amount is required'}, {status: 400});
    }

    console.log('Creating payment order for:', {amount, currency});

    // In a real application, you would interact with a payment provider like Razorpay or Stripe.
    // We will simulate creating an order and return a mock order ID.
    const mockOrderId = `order_${Date.now()}`;

    return NextResponse.json(
      {
        orderId: mockOrderId,
        amount: amount,
        currency: currency,
        message: 'Order created successfully',
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
