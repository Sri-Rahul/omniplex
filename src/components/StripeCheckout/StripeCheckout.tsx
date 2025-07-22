"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./StripeCheckout.module.css";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { Modal, ModalContent } from "@nextui-org/modal";
import Spinner from "../Spinner/Spinner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

// Initialize Stripe with fallback handling
let stripePromise: Promise<any> | null = null;

try {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  console.log('Stripe publishable key available:', !!publishableKey);
  if (publishableKey && publishableKey.startsWith('pk_')) {
    console.log('Initializing Stripe with key:', publishableKey.substring(0, 20) + '...');
    stripePromise = loadStripe(publishableKey);
  } else {
    console.warn('Invalid or missing Stripe publishable key');
  }
} catch (error) {
  console.warn('Stripe initialization failed:', error);
}

const StripeCheckout = (props: Props) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    console.log('Starting payment process...');

    try {
      // Check if Stripe is properly configured
      if (!stripePromise) {
        console.error('Stripe not initialized - missing publishable key');
        toast.error("Payment system not configured. Please contact support.", {
          position: "top-center",
          style: {
            padding: "6px 18px",
            color: "#fff",
            background: "#FF4B4B",
          },
        });
        setLoading(false);
        return;
      }

      console.log('Creating checkout session...');

      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceAmount: 1000, // $10.00 in cents
          productName: 'Omniplex Pro Plan',
        }),
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      console.log('Loading Stripe...');
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      console.log('Redirecting to checkout...');
      
      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }

    } catch (error: any) {
      console.error('Payment failed:', error);
      toast.error(error.message || "Payment failed. Please try again.", {
        position: "top-center",
        style: {
          padding: "6px 18px",
          color: "#fff",
          background: "#FF4B4B",
        },
      });
    }

    setLoading(false);
  };

  return (
    <Modal
      size={"lg"}
      radius="md"
      shadow="sm"
      backdrop={"blur"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      placement="bottom-center"
      closeButton={<div></div>}
    >
      <ModalContent>
        {(onClose) => (
          <div className={styles.modal}>
            <div className={styles.titleContainer}>
              <div className={styles.title}></div>
              <div
                className={styles.close}
                onClick={() => {
                  onClose();
                }}
              >
                <Image
                  width={20}
                  height={20}
                  src={"/svgs/CrossWhite.svg"}
                  alt={"X"}
                />
              </div>
            </div>
            <div className={styles.container}>
              <div className={styles.title}>Upgrade to Pro</div>
              <p className={styles.text}>Unlock advanced features with Omniplex Pro</p>
              
              <div className={styles.features}>
                <div className={styles.feature}>
                  <Image
                    src={"/svgs/Check.svg"}
                    alt={"Check"}
                    width={16}
                    height={16}
                  />
                  <span>Unlimited conversations</span>
                </div>
                <div className={styles.feature}>
                  <Image
                    src={"/svgs/Check.svg"}
                    alt={"Check"}
                    width={16}
                    height={16}
                  />
                  <span>Priority support</span>
                </div>
                <div className={styles.feature}>
                  <Image
                    src={"/svgs/Check.svg"}
                    alt={"Check"}
                    width={16}
                    height={16}
                  />
                  <span>Advanced AI models</span>
                </div>
                <div className={styles.feature}>
                  <Image
                    src={"/svgs/Check.svg"}
                    alt={"Check"}
                    width={16}
                    height={16}
                  />
                  <span>File upload & analysis</span>
                </div>
              </div>

              <div className={styles.priceContainer}>
                <div className={styles.price}>$10.00</div>
                <div className={styles.priceText}>one-time payment</div>
              </div>

              {loading ? (
                <div className={styles.button}>
                  <div className={styles.spinner}>
                    <Spinner />
                  </div>
                  <div className={styles.buttonText}>Processing...</div>
                </div>
              ) : (
                <div className={styles.button} onClick={handlePayment}>
                  <div className={styles.buttonText}>Subscribe to Pro Plan</div>
                </div>
              )}

              <div className={styles.secureText}>
                <Image
                  src={"/svgs/Info.svg"}
                  alt={"Info"}
                  width={14}
                  height={14}
                />
                <span>Secured by Stripe. Test mode only.</span>
              </div>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default StripeCheckout;
