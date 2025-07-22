# Quick Test Guide - Stripe Integration with Test Login

## 🧪 **Testing the Complete Stripe Flow**

### **Step 1: Access Test Login**
1. Open http://localhost:3000
2. Click the **hamburger menu** (three lines) in the top left
3. Click the **User icon** at the bottom of the sidebar
4. In the auth modal, click **"Test Login (Demo Mode)"** (blue button)
   - This bypasses Google sign-in and creates a test user
   - User details: Test User (test@omniplex.ai)

### **Step 2: Access Profile & Stripe Integration**
1. After test login, click the **User icon** again in the sidebar
2. You should see the Profile section with:
   - Test user profile image and details
   - **"✨ Upgrade to Pro - $10"** button (blue/purple)

### **Step 3: Test Stripe Payment Flow**
1. Click **"✨ Upgrade to Pro - $10"**
2. Stripe checkout modal opens showing:
   - Pro features list
   - $10.00 pricing
   - "Subscribe to Pro Plan" button
3. Click **"Subscribe to Pro Plan"**
4. Redirects to Stripe Checkout page

### **Step 4: Complete Test Payment**
Use these **test card details** (Stripe test mode):
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., `12/25`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP**: Any 5 digits (e.g., `12345`)

### **Step 5: Verify Success**
1. After successful payment → redirects to **Payment Success** page
2. Shows confirmation message and features
3. Test navigation buttons:
   - "Start Using Pro Features" → Home page
   - "Continue to Chat" → Chat page

### **Step 6: Test Cancel Flow (Optional)**
1. Repeat steps 1-3
2. On Stripe checkout page, click **browser back button**
3. Should redirect to **Payment Cancel** page
4. Shows retry options

## 🔍 **What to Look For**

### **✅ Success Indicators**
- Test login works without Firebase
- Profile section accessible
- Stripe modal opens with proper styling
- Payment redirects to Stripe (real Stripe checkout)
- Success/cancel pages load properly
- All styling matches the app theme

### **🚨 Potential Issues**
- If Stripe keys are invalid → "Payment system not configured" error
- If modal doesn't open → Check browser console for errors
- If styling looks broken → CSS modules not loading

## 📊 **Verify in Stripe Dashboard**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/payments)
2. You should see test payments after completing the flow
3. Check payment details and amounts

## 🎯 **Expected Behavior**
- **Test Login**: Instant access to profile without Firebase
- **UI Consistency**: All components match existing dark theme
- **Secure Processing**: Actual Stripe checkout (not fake)
- **Error Handling**: Graceful fallbacks for missing configuration
- **User Feedback**: Clear success/error messages

## 🚀 **Ready to Test!**

You now have:
1. ✅ Test account access (bypasses Firebase)
2. ✅ Active Stripe keys in environment
3. ✅ Complete payment flow UI
4. ✅ Success/cancel handling
5. ✅ Proper error handling

**Go ahead and test the complete flow!** 🎉
