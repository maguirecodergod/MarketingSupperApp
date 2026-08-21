export interface RetryPolicy {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffFactor: number;
}

export const defaultRetryPolicy: RetryPolicy = {
  maxRetries: 3,
  initialDelayMs: 300,
  maxDelayMs: 3000,
  backoffFactor: 2,
};

export function isRetryableMethod(method: string): boolean {
  const m = method.toUpperCase();
  return m === 'GET' || m === 'HEAD' || m === 'OPTIONS';
}

export function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 429 || status === 502 || status === 503 || status === 504;
}

export function calculateBackoff(
  attempt: number,
  policy: RetryPolicy,
  retryAfterSeconds?: number,
): number {
  if (retryAfterSeconds && retryAfterSeconds > 0) {
    return Math.min(retryAfterSeconds * 1000, policy.maxDelayMs);
  }
  const delay = policy.initialDelayMs * Math.pow(policy.backoffFactor, attempt);
  const jitter = delay * 0.1 * (Math.random() - 0.5);
  return Math.min(Math.max(0, delay + jitter), policy.maxDelayMs);
}
