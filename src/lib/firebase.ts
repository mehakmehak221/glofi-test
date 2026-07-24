import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, Auth, initializeRecaptchaConfig } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

let firebaseAuth: Auth | undefined;
let recaptchaConfigPromise: Promise<void> | null = null;

if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  try {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    firebaseAuth = getAuth(app);
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
} else {
  console.warn("Firebase API key is missing. Authentication features will fail if triggered.");
}

export const isFirebasePhoneAuthEnabled =
  Boolean(firebaseAuth) &&
  process.env.NEXT_PUBLIC_ENABLE_FIREBASE_PHONE_AUTH !== "false";

export async function ensureFirebasePhoneAuthReady(): Promise<void> {
  if (typeof window === "undefined" || !firebaseAuth || !isFirebasePhoneAuthEnabled) {
    return;
  }

  if (!recaptchaConfigPromise) {
    recaptchaConfigPromise = (async () => {
      if (process.env.NEXT_PUBLIC_FIREBASE_PHONE_AUTH_TEST_MODE === "true") {
        firebaseAuth!.settings.appVerificationDisabledForTesting = true;
      }
      await initializeRecaptchaConfig(firebaseAuth!);
    })().catch((error) => {
      recaptchaConfigPromise = null;
      throw error;
    });
  }

  return recaptchaConfigPromise;
}

export { firebaseAuth };
