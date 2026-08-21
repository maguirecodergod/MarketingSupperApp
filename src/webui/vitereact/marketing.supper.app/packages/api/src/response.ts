import {
  ApiError,
  AuthError,
  ValidationError,
  RateLimitError,
  ConflictError,
  type ProblemDetails,
} from './errors.js';
import { etagAdapter } from './etag.js';
import type { RequestContext } from './request-context.js';

export async function handleApiResponse<T>(
  response: Response,
  url: string,
  context: RequestContext,
): Promise<T> {
  // Capture ETag header if present on successful responses
  const etag = response.headers.get('ETag');
  if (etag && response.ok) {
    etagAdapter.set(url, etag);
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  // Check 304 Not Modified
  if (response.status === 304) {
    return undefined as unknown as T;
  }

  const contentType = response.headers.get('Content-Type') || '';
  const isJson = contentType.includes('application/json') || contentType.includes('application/problem+json');

  let data: unknown;
  if (isJson) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  if (response.ok) {
    return data as T;
  }

  // Normalize errors
  const problem = (typeof data === 'object' && data !== null ? data : {}) as Partial<ProblemDetails>;
  const correlationId = response.headers.get('X-Correlation-Id') || problem.correlationId || context.correlationId;
  const requestId = response.headers.get('X-Request-Id') || context.requestId;
  const safeMessage = problem.detail || problem.title || `Request failed with status ${response.status}`;

  if (response.status === 401 || response.status === 403) {
    throw new AuthError({
      message: safeMessage,
      status: response.status,
      code: problem.code,
      correlationId,
      raw: problem,
    });
  }

  if (response.status === 422) {
    throw new ValidationError({
      message: safeMessage,
      correlationId,
      fieldErrors: problem.errors,
      raw: problem,
    });
  }

  if (response.status === 429) {
    const retryAfterHeader = response.headers.get('Retry-After');
    const retryAfterSeconds = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 5;
    throw new RateLimitError({
      message: safeMessage,
      correlationId,
      retryAfterSeconds: isNaN(retryAfterSeconds) ? 5 : retryAfterSeconds,
      raw: problem,
    });
  }

  if (response.status === 409) {
    throw new ConflictError({
      message: safeMessage,
      correlationId,
      raw: problem,
    });
  }

  throw new ApiError({
    message: safeMessage,
    status: response.status,
    code: problem.code || `HTTP_${response.status}`,
    correlationId,
    requestId,
    retryable: response.status >= 500 && response.status <= 504,
    fieldErrors: problem.errors,
    raw: problem,
  });
}
