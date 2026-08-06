import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let firebaseAuth: Auth | undefined;
let firebaseAnalytics: ReturnType<typeof getAnalytics> | undefined;

if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  try {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    firebaseAuth = getAuth(app);

    if (typeof window !== "undefined" && firebaseConfig.measurementId) {
      try {
        firebaseAnalytics = getAnalytics(app);
      } catch {
      }
    }
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
} else {
  console.warn("Firebase API key is missing. Authentication features will fail if triggered. env keys:", Object.keys(process.env).filter(k => k.startsWith("NEXT_PUBLIC_")));
}

export const isFirebasePhoneAuthEnabled =
  Boolean(firebaseAuth) &&
  process.env.NEXT_PUBLIC_ENABLE_FIREBASE_PHONE_AUTH !== "false";

export async function ensureFirebasePhoneAuthReady(): Promise<void> {
  if (typeof window === "undefined" || !firebaseAuth || !isFirebasePhoneAuthEnabled) {
    return;
  }

  const testMode = process.env.NEXT_PUBLIC_FIREBASE_PHONE_AUTH_TEST_MODE === "true";

  if (testMode) {
    firebaseAuth.settings.appVerificationDisabledForTesting = true;
  } else {
    firebaseAuth.settings.appVerificationDisabledForTesting = false;
  }
}

export { firebaseAuth, firebaseAnalytics };
