import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('=== Stripe Config Debug ===');
    console.log('process.env available:', typeof process.env);
    console.log('process.env is object:', typeof process.env === 'object');
    console.log('process.env keys count:', Object.keys(process.env).length);
    
    // Test basic environment access
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('PATH available:', !!process.env.PATH);
    
    // Try multiple ways to access the environment variables
    const env = process.env;
    console.log('env variable access test:', typeof env);
    
    // Get all keys and filter them
    const allKeys = Object.keys(env);
    console.log('Total keys found:', allKeys.length);
    
    const stripeKeys = allKeys.filter(k => k.includes('STRIPE'));
    const nextPublicKeys = allKeys.filter(k => k.includes('NEXT_PUBLIC'));
    const appSettingKeys = allKeys.filter(k => k.includes('APPSETTING'));
    
    console.log('Stripe keys found:', stripeKeys);
    console.log('NEXT_PUBLIC keys found:', nextPublicKeys);
    console.log('APPSETTING keys found:', appSettingKeys);
    
    // Direct access attempts
    const tests = {
      direct_next_public: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      direct_stripe: env.STRIPE_SECRET_KEY,
      appsetting_next_public: env.APPSETTING_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      appsetting_stripe: env.APPSETTING_STRIPE_SECRET_KEY,
    };
    
    console.log('Direct access tests:', Object.keys(tests).map(k => ({ [k]: !!tests[k as keyof typeof tests] })));
    
    // Get the final values
    const publishableKey = env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || env.APPSETTING_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const secretKey = env.STRIPE_SECRET_KEY || env.APPSETTING_STRIPE_SECRET_KEY;
    
    console.log('Final publishable key found:', !!publishableKey);
    console.log('Final secret key found:', !!secretKey);
    
    if (publishableKey && publishableKey.startsWith('pk_')) {
      console.log('✓ SUCCESS: Returning valid Stripe configuration');
      return NextResponse.json({
        publishableKey,
        configured: true,
        debug: {
          hasPublishableKey: true,
          hasSecretKey: !!secretKey,
          nodeEnv: env.NODE_ENV,
          keyPrefix: publishableKey.substring(0, 10),
          source: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'direct' : 'appsetting',
          secretSource: env.STRIPE_SECRET_KEY ? 'direct' : 'appsetting',
          totalEnvKeys: allKeys.length,
          stripeKeysFound: stripeKeys,
          nextPublicKeysFound: nextPublicKeys,
          appSettingKeysFound: appSettingKeys,
        }
      });
    } else {
      console.warn('✗ FAILED: Stripe publishable key not found or invalid');
      
      return NextResponse.json({
        publishableKey: null,
        configured: false,
        error: 'Stripe publishable key not found or invalid',
        debug: {
          hasPublishableKey: false,
          hasSecretKey: !!secretKey,
          nodeEnv: env.NODE_ENV,
          totalEnvKeys: allKeys.length,
          stripeKeysFound: stripeKeys,
          nextPublicKeysFound: nextPublicKeys,
          appSettingKeysFound: appSettingKeys,
          tests: Object.keys(tests).map(k => ({ [k]: !!tests[k as keyof typeof tests] })),
          // Safe to show these as they'll be undefined if not found
          directValues: {
            publishable: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'found' : 'not found',
            secret: env.STRIPE_SECRET_KEY ? 'found' : 'not found',
            appPublishable: env.APPSETTING_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'found' : 'not found',
            appSecret: env.APPSETTING_STRIPE_SECRET_KEY ? 'found' : 'not found',
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
        stack: error.stack,
        nodeEnv: process.env?.NODE_ENV || 'unknown',
      }
    });
  }
}
