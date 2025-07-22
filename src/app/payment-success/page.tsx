import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./PaymentSuccess.module.css";

export default function PaymentSuccess() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <Image
            src="/svgs/Check.svg"
            alt="Success"
            width={48}
            height={48}
            className={styles.successIcon}
          />
        </div>
        
        <div className={styles.content}>
          <h1 className={styles.title}>Payment Successful!</h1>
          <p className={styles.description}>
            Thank you for subscribing to Omniplex Pro. Your account has been upgraded
            and you now have access to all premium features.
          </p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <Image
                src="/svgs/Check.svg"
                alt="Check"
                width={16}
                height={16}
              />
              <span>Unlimited conversations</span>
            </div>
            <div className={styles.feature}>
              <Image
                src="/svgs/Check.svg"
                alt="Check"
                width={16}
                height={16}
              />
              <span>Priority support</span>
            </div>
            <div className={styles.feature}>
              <Image
                src="/svgs/Check.svg"
                alt="Check"
                width={16}
                height={16}
              />
              <span>Advanced AI models</span>
            </div>
            <div className={styles.feature}>
              <Image
                src="/svgs/Check.svg"
                alt="Check"
                width={16}
                height={16}
              />
              <span>File upload & analysis</span>
            </div>
          </div>
        </div>
        
        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            Start Using Pro Features
          </Link>
          <Link href="/chat" className={styles.secondaryButton}>
            Continue to Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
