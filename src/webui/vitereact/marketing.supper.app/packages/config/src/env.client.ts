import { envSchema, type EnvConfig } from './env.schema.js';

export function parseClientEnv(rawEnv: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(rawEnv);
  if (!result.success) {
    const errorDetails = result.error.errors.map((e) => `[${e.path.join('.')}]: ${e.message}`).join('\n');
    console.error('❌ Environment configuration validation failed:\n' + errorDetails);
    throw new Error('Environment configuration validation failed: ' + errorDetails);
  }
  return result.data;
}
