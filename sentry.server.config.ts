import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: "https://48dbe2101679eb3770d52a426a4ee6eb@o265960.ingest.us.sentry.io/4507631006318592",
  tracesSampleRate: 1.0,  // Puedes ajustar esta tasa de muestreo según tus necesidades
});
