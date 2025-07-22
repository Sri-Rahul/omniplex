# Stripe Integration Testing Guide

## Overview
This guide helps you test the Stripe payment integration in Omniplex (Test Mode Only).

## Prerequisites
1. Development server running (`npm run dev`)
2. Valid Stripe test API keys in `.env.local`
3. Modern web browser

## Test Setup

### Step 1: Configure Stripe Test Keys
Add these to your `.env.local` file:
```bash
# Stripe Test Keys (get these from your Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Step 2: Test Without API Keys (Graceful Degradation)
1. Comment out or remove Stripe keys from `.env.local`
2. Restart dev server
3. Try to access Pro upgrade - should show "Payment system not configured" message

### Step 3: Test With Valid API Keys

#### 3.1 Access the Upgrade Flow
1. Open http://localhost:3001
2. Click the menu/sidebar icon (top left)
3. Click the User icon (bottom of sidebar)
4. Click "✨ Upgrade to Pro - $10" button

#### 3.2 Verify Payment Modal
- Modal should open with Pro features listed
- Price should show $10.00
- "Subscribe to Pro Plan" button should be visible
- Security message about Stripe/test mode should appear

#### 3.3 Test Payment Flow
1. Click "Subscribe to Pro Plan"
2. Should redirect to Stripe Checkout page
3. Use test card details:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)

#### 3.4 Test Success Flow
1. Complete payment with test card
2. Should redirect to `/payment-success` page
3. Verify success message and features list
4. Test "Start Using Pro Features" and "Continue to Chat" links

#### 3.5 Test Cancel Flow
1. Start payment process again
2. Click browser back button or cancel on Stripe page
3. Should redirect to `/payment-cancel` page
4. Verify cancel message and "Try Again" option

## API Endpoints Testing

### Create Payment Intent
```bash
curl -X POST http://localhost:3001/api/stripe/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000}'
```

Expected response:
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxxxx"
}
```

### Create Checkout Session
```bash
curl -X POST http://localhost:3001/api/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"priceAmount": 1000, "productName": "Omniplex Pro Plan"}'
```

Expected response:
```json
{
  "sessionId": "cs_test_xxx",
  "url": "https://checkout.stripe.com/c/pay/cs_test_xxx"
}
```

## Error Testing

### 1. Invalid Amount
```bash
curl -X POST http://localhost:3001/api/stripe/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 25}'
```
Should return: `{"error": "Amount must be at least $0.50"}`

### 2. Missing Stripe Configuration
1. Remove `STRIPE_SECRET_KEY` from `.env.local`
2. Restart server
3. Try payment - should get "not properly configured" error

### 3. Invalid API Key
1. Set invalid `STRIPE_SECRET_KEY` in `.env.local`
2. Try payment - should get Stripe authentication error

## Monitoring & Verification

### Stripe Dashboard
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test)
2. Check "Payments" section for test transactions
3. Verify payment amounts and metadata

### Browser Console
- Check for any JavaScript errors
- Monitor network requests to Stripe APIs
- Verify console.log messages for payment flow

### Server Logs
- Check terminal for Stripe initialization messages
- Look for payment intent creation logs
- Monitor webhook events (if configured)

## Common Issues & Solutions

### Issue: "Stripe not properly configured"
- **Solution**: Verify environment variables are set and server is restarted

### Issue: Stripe Checkout not loading
- **Solution**: Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is valid and public

### Issue: Payment success but webhook not received
- **Solution**: Webhook endpoint requires HTTPS in production (works locally without)

### Issue: CSS/styling issues
- **Solution**: Clear browser cache and check CSS modules are loading

## Production Considerations

**⚠️ Important**: This integration is configured for TEST MODE ONLY
- Never use live Stripe keys in this test environment
- Always verify payments in Stripe Dashboard
- Implement proper user authentication and database updates before production
- Set up proper webhook endpoint with HTTPS for production
- Add proper error handling and user feedback

## Next Steps for Production

1. Implement user subscription status in database
2. Add JWT/session management for Pro features
3. Set up proper webhook handling with database updates
4. Implement email confirmations
5. Add subscription management (cancel, upgrade, etc.)
6. Switch to live Stripe keys only after thorough testing
