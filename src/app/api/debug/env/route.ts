import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Only allow this in development or if specifically enabled
  if (process.env.NODE_ENV === 'development' || process.env.ENABLE_ENV_DEBUG === 'true') {
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      hasStripePublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      hasStripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      stripePublishableKeyPrefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 10) || 'not found',
      stripeSecretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10) || 'not found',
      allEnvKeys: Object.keys(process.env).filter(key => 
        key.includes('STRIPE') || key.includes('NEXT_PUBLIC')
      ),
    };

    return NextResponse.json(envInfo);
  } else {
    return NextResponse.json(
      { error: 'Environment debug is disabled in production' },
      { status: 403 }
    );
  }
}
