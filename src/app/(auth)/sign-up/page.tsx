// Force this route to be server-rendered on demand (not statically prerendered).
// This prevents Firebase from being initialized during the Vercel build phase
// where NEXT_PUBLIC_FIREBASE_* env vars are unavailable.
export const dynamic = "force-dynamic";

export { default } from "./SignUpContent";
