import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Only allow this in development or if specifically enabled
  if (process.env.NODE_ENV === 'development' || process.env.ENABLE_ENV_DEBUG === 'true') {
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      hasStripePublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      hasStripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasAppSettingPublishableKey: !!process.env.APPSETTING_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      hasAppSettingSecretKey: !!process.env.APPSETTING_STRIPE_SECRET_KEY,
      stripePublishableKeyPrefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 10) || 'not found',
      stripeSecretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10) || 'not found',
      appSettingPublishableKeyPrefix: process.env.APPSETTING_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 10) || 'not found',
      appSettingSecretKeyPrefix: process.env.APPSETTING_STRIPE_SECRET_KEY?.substring(0, 10) || 'not found',
      allEnvKeys: Object.keys(process.env).filter(key => 
        key.includes('STRIPE') || key.includes('NEXT_PUBLIC') || key.includes('APPSETTING')
      ),
      totalEnvKeysCount: Object.keys(process.env).length,
      // Direct values for debugging
      directPublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'undefined',
      directSecretKey: process.env.STRIPE_SECRET_KEY || 'undefined',
      appSettingPublishableKey: process.env.APPSETTING_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'undefined',
      appSettingSecretKey: process.env.APPSETTING_STRIPE_SECRET_KEY || 'undefined',
    };

    return NextResponse.json(envInfo);
  } else {
    return NextResponse.json(
      { error: 'Environment debug is disabled in production' },
      { status: 403 }
    );
  }
}
