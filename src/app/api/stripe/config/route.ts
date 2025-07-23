import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('=== Stripe Config Debug ===');
    console.log('All environment keys:', Object.keys(process.env).length);
    console.log('Stripe-related keys:', Object.keys(process.env).filter(k => k.includes('STRIPE')));
    console.log('NEXT_PUBLIC keys:', Object.keys(process.env).filter(k => k.includes('NEXT_PUBLIC')));
    console.log('APPSETTING keys:', Object.keys(process.env).filter(k => k.includes('APPSETTING')));
    
    // Get the Stripe publishable key from server-side environment (check multiple sources for Azure)
    const directPublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const appSettingPublishableKey = process.env.APPSETTING_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const publishableKey = directPublishableKey || appSettingPublishableKey;
    
    const directSecretKey = process.env.STRIPE_SECRET_KEY;
    const appSettingSecretKey = process.env.APPSETTING_STRIPE_SECRET_KEY;
    const secretKey = directSecretKey || appSettingSecretKey;
    
    console.log('Direct publishable key:', !!directPublishableKey);
    console.log('AppSetting publishable key:', !!appSettingPublishableKey);
    console.log('Final publishable key:', !!publishableKey);
    console.log('Direct secret key:', !!directSecretKey);
    console.log('AppSetting secret key:', !!appSettingSecretKey);
    console.log('Final secret key:', !!secretKey);
    
    if (publishableKey && publishableKey.startsWith('pk_')) {
      console.log('✓ Returning valid Stripe configuration');
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
      console.warn('✗ Stripe publishable key not found or invalid');
      console.warn('Direct value:', directPublishableKey);
      console.warn('AppSetting value:', appSettingPublishableKey);
      
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
          directPublishableKey: directPublishableKey || 'undefined',
          appSettingPublishableKey: appSettingPublishableKey || 'undefined',
          totalEnvKeys: Object.keys(process.env).length,
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
        stack: error.stack,
      }
    });
  }
}
