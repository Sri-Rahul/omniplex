import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the Stripe publishable key from server-side environment
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    console.log('Stripe config request:');
    console.log('- Publishable key available:', !!publishableKey);
    console.log('- Secret key available:', !!secretKey);
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    
    if (publishableKey && publishableKey.startsWith('pk_')) {
      console.log('Returning valid Stripe configuration');
      return NextResponse.json({
        publishableKey,
        configured: true,
        debug: {
          hasPublishableKey: true,
          hasSecretKey: !!secretKey,
          nodeEnv: process.env.NODE_ENV,
          keyPrefix: publishableKey.substring(0, 10),
        }
      });
    } else {
      console.warn('Stripe publishable key not found or invalid');
      console.warn('Available env keys containing STRIPE:', Object.keys(process.env).filter(k => k.includes('STRIPE')));
      
      return NextResponse.json({
        publishableKey: null,
        configured: false,
        error: 'Stripe publishable key not found or invalid',
        debug: {
          hasPublishableKey: false,
          hasSecretKey: !!secretKey,
          nodeEnv: process.env.NODE_ENV,
          availableStripeKeys: Object.keys(process.env).filter(k => k.includes('STRIPE')),
          allNextPublicKeys: Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC')),
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
        nodeEnv: process.env.NODE_ENV,
      }
    });
  }
}
