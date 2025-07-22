import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Stripe with fallback handling
let stripe: Stripe | null = null;

try {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (stripeSecretKey && stripeSecretKey.startsWith('sk_')) {
    stripe = new Stripe(stripeSecretKey);
  }
} catch (error) {
  console.warn('Stripe initialization failed:', error);
}

// Use Node.js runtime for full Stripe SDK support
// export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is properly configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not properly configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { 
      priceAmount = 1000, 
      currency = 'usd',
      productName = 'Omniplex Pro Plan',
      successUrl,
      cancelUrl
    } = body;

    // Get the origin from the request headers
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    
    // Default URLs if not provided
    const defaultSuccessUrl = `${origin}/payment-success`;
    const defaultCancelUrl = `${origin}/payment-cancel`;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: productName,
              description: 'Unlock advanced features with Omniplex Pro',
            },
            unit_amount: Math.round(priceAmount),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || defaultSuccessUrl,
      cancel_url: cancelUrl || defaultCancelUrl,
      metadata: {
        product: productName,
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    console.error('Stripe checkout session creation failed:', error);
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to create checkout session.' },
    { status: 405 }
  );
}
