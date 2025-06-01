import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

export function initSentry() {
  if (process.env.NODE_ENV === "production") {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
    });
  }
}

export function captureException(error: Error) {
  if (process.env.NODE_ENV === "production") {
    Sentry.captureException(error);
  } else {
    console.error(error);
  }
} 