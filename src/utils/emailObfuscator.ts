export const obfuscateEmail = (email: string): string => {
  return email.replace(/./g, '*');
};

export const deobfuscateEmail = (email: string): string => {
  // This is just a placeholder - in reality, you would use a more secure method
  // like fetching the real email from an API endpoint with rate limiting
  return 'omarbouajaja48@gmail.com';
};

export const createMailtoLink = (email: string): string => {
  const chars: string[] = [];
  email.split('').forEach(char => {
    chars.push(`&#${char.charCodeAt(0)};`);
  });
  return `mailto:${chars.join('')}`;
};

// Rate limiting for contact form
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds
const MAX_ATTEMPTS = 3;

interface RateLimitEntry {
  timestamp: number;
  attempts: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry) {
    rateLimitStore.set(identifier, { timestamp: now, attempts: 1 });
    return true;
  }

  if (now - entry.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(identifier, { timestamp: now, attempts: 1 });
    return true;
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    return false;
  }

  entry.attempts += 1;
  rateLimitStore.set(identifier, entry);
  return true;
};

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.timestamp > RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW); 