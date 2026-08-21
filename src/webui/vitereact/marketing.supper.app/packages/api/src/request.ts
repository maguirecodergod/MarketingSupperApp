import { createRequestContext, type RequestContext } from './request-context.js';
import { buildRequestHeaders } from './headers.js';
import { handleApiResponse } from './response.js';
import {
  defaultRetryPolicy,
  isRetryableMethod,
  isRetryableStatus,
  calculateBackoff,
  type RetryPolicy,
} from './retry.js';
import { NetworkError, TimeoutError, ApiError } from './errors.js';
import { etagAdapter } from './etag.js';
import { buildQueryParams } from './pagination.js';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
  path: string;
  query?: Record<string, unknown>;
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
  retry?: Partial<RetryPolicy>;
  idempotencyKey?: string;
  ifMatch?: string;
  useETag?: boolean;
  context?: Partial<RequestContext>;
  baseUrl?: string;
}

export const DEFAULT_TIMEOUT_MS = 15000;

export async function executeRequest<T>(options: RequestOptions): Promise<T> {
  const method = options.method || 'GET';
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const baseUrl = options.baseUrl || '/api/v1';
  const queryString = options.query ? buildQueryParams(options.query) : '';
  const fullUrl = `${baseUrl.replace(/\/$/, '')}${options.path.startsWith('/') ? options.path : `/${options.path}`}${queryString}`;

  const context = createRequestContext({
    ...options.context,
    idempotencyKey: options.idempotencyKey,
    ifMatch: options.ifMatch,
    ifNoneMatch: options.useETag ? etagAdapter.get(fullUrl) : undefined,
  });

  const retryPolicy: RetryPolicy = {
    ...defaultRetryPolicy,
    ...options.retry,
  };

  const hasBody = options.body !== undefined && options.body !== null && method !== 'GET' && method !== 'HEAD';
  const requestHeaders = buildRequestHeaders(context, hasBody, options.headers);

  let attempt = 0;

  while (true) {
    // Combine AbortSignal from caller and timeout controller
    const timeoutController = new AbortController();
    const timeoutTimer = setTimeout(() => {
      timeoutController.abort(new TimeoutError(timeoutMs, context.correlationId));
    }, timeoutMs);

    const onCallerAbort = () => {
      timeoutController.abort(options.signal?.reason);
    };

    if (options.signal) {
      if (options.signal.aborted) {
        clearTimeout(timeoutTimer);
        throw options.signal.reason;
      }
      options.signal.addEventListener('abort', onCallerAbort, { once: true });
    }

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: requestHeaders,
        body: hasBody ? JSON.stringify(options.body) : undefined,
        signal: timeoutController.signal,
        credentials: 'include',
      });

      clearTimeout(timeoutTimer);
      if (options.signal) {
        options.signal.removeEventListener('abort', onCallerAbort);
      }

      // If retryable HTTP status on idempotent/safe request
      if (!response.ok && (isRetryableMethod(method) || options.idempotencyKey) && isRetryableStatus(response.status) && attempt < retryPolicy.maxRetries) {
        attempt++;
        const retryAfterHeader = response.headers.get('Retry-After');
        const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : undefined;
        const delay = calculateBackoff(attempt, retryPolicy, retryAfter);
        await new Promise((res) => setTimeout(res, delay));
        continue;
      }

      return await handleApiResponse<T>(response, fullUrl, context);
    } catch (err: unknown) {
      clearTimeout(timeoutTimer);
      if (options.signal) {
        options.signal.removeEventListener('abort', onCallerAbort);
      }

      // Check for caller abort
      if (options.signal?.aborted) {
        throw options.signal.reason;
      }

      if (err instanceof TimeoutError) {
        if ((isRetryableMethod(method) || options.idempotencyKey) && attempt < retryPolicy.maxRetries) {
          attempt++;
          const delay = calculateBackoff(attempt, retryPolicy);
          await new Promise((res) => setTimeout(res, delay));
          continue;
        }
        throw err;
      }

      if (err instanceof ApiError) {
        throw err;
      }

      // General network error
      const netErr = new NetworkError(
        err instanceof Error ? err.message : 'Network connection failure',
        context.correlationId,
      );

      if ((isRetryableMethod(method) || options.idempotencyKey) && attempt < retryPolicy.maxRetries) {
        attempt++;
        const delay = calculateBackoff(attempt, retryPolicy);
        await new Promise((res) => setTimeout(res, delay));
        continue;
      }

      throw netErr;
    }
  }
}
