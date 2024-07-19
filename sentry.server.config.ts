import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://48dbe2101679eb3770d52a426a4ee6eb@o265960.ingest.us.sentry.io/4507631006318592",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
