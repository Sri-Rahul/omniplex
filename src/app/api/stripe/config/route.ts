import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the Stripe publishable key from server-side environment (check multiple sources for Azure)
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
                          process.env.APPSETTING_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    const secretKey = process.env.STRIPE_SECRET_KEY || 
                      process.env.APPSETTING_STRIPE_SECRET_KEY;
    
    console.log('Stripe config request:');
    console.log('- Publishable key available:', !!publishableKey);
    console.log('- Secret key available:', !!secretKey);
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- Available env keys:', Object.keys(process.env).filter(k => 
      k.includes('STRIPE') || k.startsWith('NEXT_PUBLIC') || k.startsWith('APPSETTING')
    ));
    
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
          source: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'direct' : 'appsetting',
        }
      });
    } else {
      console.warn('Stripe publishable key not found or invalid');
      console.warn('Publishable key value:', publishableKey);
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
          allAppSettingKeys: Object.keys(process.env).filter(k => k.startsWith('APPSETTING')),
          publishableKeyValue: publishableKey || 'undefined',
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
