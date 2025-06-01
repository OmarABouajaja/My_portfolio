// Rate limiting for contact form
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds
const MAX_ATTEMPTS = 3; // Max allowed attempts per window

interface RateLimitEntry {
  timestamp: number; // Last attempt timestamp
  attempts: number;  // Number of attempts in current window
}

const rateLimitStore = new Map<string, RateLimitEntry>(); // Stores rate limit data per identifier

// Returns true if under the rate limit, false if blocked
export const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // If no entry exists, create a new one
  if (!entry) {
    rateLimitStore.set(identifier, { timestamp: now, attempts: 1 });
    return true;
  }

  // If the window has expired, reset the entry
  if (now - entry.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(identifier, { timestamp: now, attempts: 1 });
    return true;
  }

  // If max attempts reached, block further attempts
  if (entry.attempts >= MAX_ATTEMPTS) {
    return false;
  }

  // Increment attempts and update the entry
  entry.attempts += 1;
  rateLimitStore.set(identifier, entry);
  return true;
};

// Periodically clean up expired entries
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.timestamp > RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW); 