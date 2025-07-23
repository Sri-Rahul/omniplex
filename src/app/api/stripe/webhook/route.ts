import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
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
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  try {
    // Check if Stripe is properly configured, retry initialization if needed
    if (!stripe) {
      console.log('Stripe not initialized, attempting retry...');
      const initialized = initializeStripe();
      if (!initialized) {
        return NextResponse.json(
          { error: 'Stripe is not properly configured' },
          { status: 500 }
        );
      }
    }

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe!.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Here you would typically:
        // 1. Update the user's subscription status in your database
        // 2. Send a confirmation email
        // 3. Grant access to pro features
        
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', failedPayment.id);
        
        // Handle failed payment
        break;

      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);
        
        // Here you would typically:
        // 1. Retrieve the session to get payment details
        // 2. Update user's pro status
        // 3. Send confirmation
        
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST for webhooks.' },
    { status: 405 }
  );
}
