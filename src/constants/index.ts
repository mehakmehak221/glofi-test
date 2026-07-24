const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.glofiestates.com";

// Normalize away a deployed `/api` prefix so browser requests hit the live backend root.
export const API_URL = rawApiUrl.replace(/\/$/, "").replace(/\/api$/, "");
