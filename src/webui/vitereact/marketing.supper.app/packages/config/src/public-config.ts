import { parseClientEnv } from './env.client.js';
import type { EnvConfig } from './env.schema.js';

let cachedConfig: EnvConfig | null = null;

export function initPublicConfig(rawEnv: Record<string, unknown>): EnvConfig {
  cachedConfig = parseClientEnv(rawEnv);
  return cachedConfig;
}

export function getPublicConfig(): EnvConfig {
  if (!cachedConfig) {
    // Fallback reading environment if already loaded in browser window
    const defaultEnv = {
      VITE_API_BASE_URL: (typeof window !== 'undefined' && (window as unknown as { __ENV__?: Record<string, string> }).__ENV__?.VITE_API_BASE_URL) || 'http://localhost:3000/api',
      VITE_APP_ENV: 'development',
      VITE_APP_VERSION: '1.0.0',
      VITE_OTEL_EXPORTER_URL: '',
      VITE_SENTRY_DSN: '',
      VITE_SENTRY_TRACES_SAMPLE_RATE: 1.0,
      VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE: 0.1,
      VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE: 1.0,
    };
    cachedConfig = parseClientEnv(defaultEnv);
  }
  return cachedConfig;
}
