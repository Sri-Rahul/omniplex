import { initializeApp, FirebaseApp } from "firebase/app";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getFirestore, Firestore } from "firebase/firestore";

// Firebase Config with environment variables fallback
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX",
};

let app: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

try {
  app = initializeApp(firebaseConfig);
  dbInstance = getFirestore(app);
  storageInstance = getStorage(app);
} catch (error) {
  console.warn("Firebase initialization failed. Firebase features will be disabled.", error);
}

// Export with fallbacks for better TypeScript support
export const db: Firestore | null = dbInstance;
export const storage: FirebaseStorage | null = storageInstance;

export const initializeFirebase = (): FirebaseApp | null => {
  return app;
};

export const isFirebaseInitialized = (): boolean => {
  return dbInstance !== null && storageInstance !== null;
};
