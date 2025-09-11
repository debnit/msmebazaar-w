
import { NextRequest, NextResponse } from 'next/server';
import { generateBusinessPlan } from '@/ai/flows/business-plan-flow';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, industry, targetAudience } = body;

    if (!businessName || !industry || !targetAudience) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { plan } = await generateBusinessPlan({ businessName, industry, targetAudience });

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Business plan generation error:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the business plan' },
      { status: 500 }
    );
  }
}
