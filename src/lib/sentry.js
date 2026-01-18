import * as Sentry from "@sentry/react";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'development';

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    
    // Performance Monitoring
    tracesSampleRate: 1.0,
    
    // Session Replay (only if available)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    beforeSend(event, hint) {
      // Don't send user rejected errors
      if (hint.originalException?.message?.includes('User rejected')) {
        return null;
      }
      return event;
    },
    
    // Enable integrations based on Sentry version
    integrations: function(integrations) {
      // Filter out BrowserTracing and Replay if they don't exist
      return integrations.filter(integration => {
        return integration.name !== 'BrowserTracing' && integration.name !== 'Replay';
      });
    },
  });
  
  console.log('✅ Sentry initialized');
} else {
  console.log('ℹ️ Sentry not configured (optional)');
}

export const captureError = (error, context = {}) => {
  console.error('Error captured:', error, context);

  if (SENTRY_DSN) {
    Sentry.captureException(error, {
      tags: context.tags || {},
      extra: context.extra || {},
      level: context.level || 'error'
    });
  }
};

export const captureMessage = (message, level = 'info', context = {}) => {
  if (SENTRY_DSN) {
    Sentry.captureMessage(message, {
      level,
      tags: context.tags || {},
      extra: context.extra || {}
    });
  }
};

export default Sentry;
