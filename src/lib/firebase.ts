import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, Auth, initializeRecaptchaConfig } from "firebase/auth";

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

let recaptchaInitPromise: Promise<void> | null = null;

function isLocalhost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  try {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    firebaseAuth = getAuth(app);

    if (typeof window !== "undefined" && firebaseConfig.measurementId) {
      try {
        firebaseAnalytics = getAnalytics(app);
      } catch {
        // Analytics is non-critical; ignore (e.g. blocked by ad-blockers).
      }
    }
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
} else {
  console.warn("Firebase API key is missing. Authentication features will fail if triggered.");
}

export const isFirebasePhoneAuthEnabled =
  Boolean(firebaseAuth) &&
  process.env.NEXT_PUBLIC_ENABLE_FIREBASE_PHONE_AUTH !== "false";

/**
 * Must be awaited before calling signInWithPhoneNumber.
 *
 * This project uses reCAPTCHA Enterprise (visible in Google Cloud Fraud Defense
 * console). Firebase Phone Auth on web with Enterprise requires
 * initializeRecaptchaConfig() so the SDK can fetch the Enterprise config and
 * swap v2 RecaptchaVerifier tokens for valid Enterprise tokens before sending
 * them to Firebase's backend. Without this, sendVerificationCode receives a v2
 * token when it expects an Enterprise token → INVALID_APP_CREDENTIAL.
 *
 * In test/local mode we also disable app verification so real reCAPTCHA
 * challenges are never shown during development.
 */
export async function ensureFirebasePhoneAuthReady(): Promise<void> {
  if (typeof window === "undefined" || !firebaseAuth || !isFirebasePhoneAuthEnabled) {
    return;
  }

  if (!recaptchaInitPromise) {
    recaptchaInitPromise = (async () => {
      // Bypass real reCAPTCHA challenges in local/test environments.
      const testMode = process.env.NEXT_PUBLIC_FIREBASE_PHONE_AUTH_TEST_MODE === "true";
      if (testMode || isLocalhost()) {
        firebaseAuth!.settings.appVerificationDisabledForTesting = true;
      }

      // Fetch the reCAPTCHA Enterprise config from Firebase. This must complete
      // before RecaptchaVerifier is instantiated — otherwise the SDK doesn't know
      // to use Enterprise tokens and falls back to v2 format.
      await initializeRecaptchaConfig(firebaseAuth!);
    })().catch((err) => {
      // Reset so next call can retry.
      recaptchaInitPromise = null;
      throw err;
    });
  }

  return recaptchaInitPromise;
}

export { firebaseAuth, firebaseAnalytics };