import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('=== Stripe Config Debug ===');
    
    // Use the EXACT same approach as the debug endpoint that works
    const hasStripePublishableKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const hasStripeSecretKey = !!process.env.STRIPE_SECRET_KEY;
    const hasAppSettingPublishableKey = !!process.env.APPSETTING_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const hasAppSettingSecretKey = !!process.env.APPSETTING_STRIPE_SECRET_KEY;
    
    // Get the actual values using the same pattern as debug endpoint
    const directPublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const directSecretKey = process.env.STRIPE_SECRET_KEY;
    const appSettingPublishableKey = process.env.APPSETTING_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const appSettingSecretKey = process.env.APPSETTING_STRIPE_SECRET_KEY;
    
    // Choose the publishable key (prefer direct, fallback to appsetting)
    const publishableKey = directPublishableKey || appSettingPublishableKey;
    const secretKey = directSecretKey || appSettingSecretKey;
    
    console.log('Stripe keys found:', {
      hasStripePublishableKey,
      hasStripeSecretKey,
      hasAppSettingPublishableKey,
      hasAppSettingSecretKey,
      finalPublishableKey: !!publishableKey,
      finalSecretKey: !!secretKey
    });
    
    if (publishableKey && publishableKey.startsWith('pk_')) {
      console.log('✓ SUCCESS: Returning valid Stripe configuration');
      return NextResponse.json({
        publishableKey,
        configured: true,
        debug: {
          hasPublishableKey: true,
          hasSecretKey: !!secretKey,
          nodeEnv: process.env.NODE_ENV,
          keyPrefix: publishableKey.substring(0, 10),
          source: directPublishableKey ? 'direct' : 'appsetting',
          secretSource: directSecretKey ? 'direct' : 'appsetting',
        }
      });
    } else {
      console.warn('✗ FAILED: Stripe publishable key not found or invalid');
      console.warn('Values:', {
        directPublishableKey: directPublishableKey || 'undefined',
        appSettingPublishableKey: appSettingPublishableKey || 'undefined',
        publishableKey: publishableKey || 'undefined'
      });
      
      return NextResponse.json({
        publishableKey: null,
        configured: false,
        error: 'Stripe publishable key not found or invalid',
        debug: {
          hasPublishableKey: false,
          hasSecretKey: !!secretKey,
          nodeEnv: process.env.NODE_ENV,
          checks: {
            hasStripePublishableKey,
            hasStripeSecretKey,
            hasAppSettingPublishableKey,
            hasAppSettingSecretKey
          },
          values: {
            directPublishableKey: directPublishableKey ? 'found' : 'not found',
            directSecretKey: directSecretKey ? 'found' : 'not found',
            appSettingPublishableKey: appSettingPublishableKey ? 'found' : 'not found',
            appSettingSecretKey: appSettingSecretKey ? 'found' : 'not found',
          }
        }
      });
    }
  } catch (error: any) {
    console.error('Stripe config error:', error);
    return NextResponse.json({
      publishableKey: null,
      configured: false,
      error: error.message || 'Failed to get Stripe configuration',
      debug: {
        errorMessage: error.message,
        errorType: error.constructor.name,
        nodeEnv: process.env?.NODE_ENV || 'unknown',
      }
    });
  }
}
