// Stripe configuration utility for Azure deployment compatibility

export const getStripePublishableKey = (): string | null => {
  // Try multiple sources for the publishable key
  let publishableKey: string | undefined;

  // 1. Next.js environment variable (build time)
  if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  }

  // 2. Runtime config (Azure deployment)
  if (!publishableKey && typeof window !== 'undefined') {
    try {
      // Try to get from window object if injected
      publishableKey = (window as any).__RUNTIME_CONFIG__?.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    } catch (error) {
      console.debug('No runtime config found');
    }
  }

  // 3. Try to get from global process.env again (Azure Web Apps sometimes set these differently)
  if (!publishableKey && typeof process !== 'undefined' && process.env) {
    publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  }

  if (publishableKey && publishableKey.startsWith('pk_')) {
    console.log('Stripe publishable key found:', publishableKey.substring(0, 20) + '...');
    return publishableKey;
  }

  console.warn('No valid Stripe publishable key found');
  return null;
};

export const getStripeSecretKey = (): string | null => {
  // Try multiple sources for the secret key
  let secretKey: string | undefined;

  // 1. Next.js environment variable
  if (process.env.STRIPE_SECRET_KEY) {
    secretKey = process.env.STRIPE_SECRET_KEY;
  }

  // 2. Try to get from global process.env again (Azure Web Apps sometimes set these differently)
  if (!secretKey && typeof process !== 'undefined' && process.env) {
    secretKey = process.env.STRIPE_SECRET_KEY;
  }

  if (secretKey && secretKey.startsWith('sk_')) {
    console.log('Stripe secret key found:', secretKey.substring(0, 20) + '...');
    return secretKey;
  }

  console.warn('No valid Stripe secret key found');
  return null;
};
