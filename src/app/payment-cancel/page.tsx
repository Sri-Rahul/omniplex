import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./PaymentCancel.module.css";

export default function PaymentCancel() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <Image
            src="/svgs/CrossRed.svg"
            alt="Cancelled"
            width={32}
            height={32}
            className={styles.cancelIcon}
          />
        </div>
        
        <div className={styles.content}>
          <h1 className={styles.title}>Payment Cancelled</h1>
          <p className={styles.description}>
            Your payment was cancelled. You can try again when you&apos;re ready to upgrade
            to Omniplex Pro and unlock all premium features.
          </p>
          
          <div className={styles.reasons}>
            <h3 className={styles.reasonsTitle}>Why upgrade to Pro?</h3>
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
            Try Again - Upgrade to Pro
          </Link>
          <Link href="/" className={styles.secondaryButton}>
            Continue with Free Plan
          </Link>
        </div>
      </div>
    </div>
  );
}
