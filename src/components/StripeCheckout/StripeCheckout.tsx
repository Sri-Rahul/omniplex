"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./StripeCheckout.module.css";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { Modal, ModalContent } from "@heroui/react";
import Spinner from "../Spinner/Spinner";
import { getStripePublishableKey } from "../../utils/stripe-config";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

// Initialize Stripe with runtime configuration for Azure deployment
let stripePromise: Promise<any> | null = null;

const initializeStripeFromServer = async (): Promise<boolean> => {
  try {
    console.log('Fetching Stripe configuration from server...');
    const response = await fetch('/api/stripe/config');
    const config = await response.json();
    
    if (config.configured && config.publishableKey) {
      console.log('Server provided Stripe key:', config.publishableKey.substring(0, 20) + '...');
      stripePromise = loadStripe(config.publishableKey);
      return true;
    } else {
      console.warn('Server-side Stripe configuration failed:', config.error);
      return false;
    }
  } catch (error) {
    console.warn('Failed to fetch Stripe config from server:', error);
    return false;
  }
};

const initializeStripe = async (): Promise<boolean> => {
  try {
    // First try the original method (build-time environment variables)
    const publishableKey = getStripePublishableKey();
    
    if (publishableKey) {
      console.log('Initializing Stripe with build-time key:', publishableKey.substring(0, 20) + '...');
      stripePromise = loadStripe(publishableKey);
      return true;
    }
    
    // If that fails, try fetching from server (runtime environment variables)
    console.log('Build-time key not available, trying server-side configuration...');
    return await initializeStripeFromServer();
  } catch (error) {
    console.warn('Stripe initialization failed:', error);
    return false;
  }
};

const StripeCheckout = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [stripeInitialized, setStripeInitialized] = useState(false);

  // Initialize Stripe when the modal opens
  useEffect(() => {
    if (props.isOpen && !stripeInitialized) {
      console.log('Modal opened, initializing Stripe...');
      initializeStripe().then((success) => {
        setStripeInitialized(success);
        if (!success) {
          console.error('Failed to initialize Stripe');
        }
      });
    }
  }, [props.isOpen, stripeInitialized]);

  const handlePayment = async () => {
    setLoading(true);
    console.log('Starting payment process...');

    try {
      // Ensure Stripe is initialized
      if (!stripePromise) {
        console.log('Stripe not initialized, attempting initialization...');
        const initialized = await initializeStripe();
        if (!initialized) {
          console.error('Stripe not initialized - configuration failed');
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
        setStripeInitialized(true);
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
              ) : !stripeInitialized ? (
                <div className={styles.button}>
                  <div className={styles.spinner}>
                    <Spinner />
                  </div>
                  <div className={styles.buttonText}>Initializing Payment...</div>
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
