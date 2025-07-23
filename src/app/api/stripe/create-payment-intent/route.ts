import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { getStripeSecretKey } from '../../../../utils/stripe-config';

// Initialize Stripe with fallback handling for Azure deployment
let stripe: Stripe | null = null;

const initializeStripe = () => {
  try {
    const stripeSecretKey = getStripeSecretKey();
    
    if (stripeSecretKey) {
      console.log('Initializing Stripe with secret key:', stripeSecretKey.substring(0, 20) + '...');
      stripe = new Stripe(stripeSecretKey);
      return true;
    } else {
      console.warn('Invalid or missing Stripe secret key');
      console.warn('Available keys:', Object.keys(process.env).filter(k => k.includes('STRIPE') || k.includes('APPSETTING')));
      return false;
    }
  } catch (error) {
    console.warn('Stripe initialization failed:', error);
    return false;
  }
};

// Initialize on module load
initializeStripe();

// Use Node.js runtime for full Stripe SDK support
// export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is properly configured, retry initialization if needed
    if (!stripe) {
      console.log('Stripe not initialized, attempting retry...');
      const initialized = initializeStripe();
      if (!initialized) {
        return NextResponse.json(
          { error: 'Stripe is not properly configured. Please check your environment variables.' },
          { status: 500 }
        );
      }
    }

    const body = await request.json();
    const { amount = 1000, currency = 'usd', metadata = {} } = body;

    // Validate amount
    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: 'Amount must be at least $0.50' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe!.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      metadata: {
        product: 'Pro Plan',
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error: any) {
    console.error('Stripe payment intent creation failed:', error);
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to create payment intent.' },
    { status: 405 }
  );
}
