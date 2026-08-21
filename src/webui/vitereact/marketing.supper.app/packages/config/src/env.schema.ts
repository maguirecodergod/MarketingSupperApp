import { z } from 'zod';

export const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url('VITE_API_BASE_URL must be a valid URL'),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production', 'test']),
  VITE_APP_VERSION: z.string().min(1, 'VITE_APP_VERSION is required'),
  VITE_OTEL_EXPORTER_URL: z.string().url().optional().or(z.literal('')),
  VITE_SENTRY_DSN: z.string().optional().or(z.literal('')),
  VITE_SENTRY_TRACES_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(1.0),
  VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(0.1),
  VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(1.0),
});

export type EnvConfig = z.infer<typeof envSchema>;
