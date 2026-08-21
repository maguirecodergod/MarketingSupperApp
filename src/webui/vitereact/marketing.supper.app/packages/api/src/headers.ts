import type { RequestContext } from './request-context.js';

export function buildRequestHeaders(
  context: RequestContext,
  hasBody: boolean,
  customHeaders?: Record<string, string>,
): Headers {
  const headers = new Headers(customHeaders);

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json, application/problem+json');
  }

  if (hasBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  headers.set('X-Correlation-Id', context.correlationId);
  headers.set('X-Request-Id', context.requestId);

  if (context.traceParent) {
    headers.set('traceparent', context.traceParent);
  }

  if (context.idempotencyKey) {
    headers.set('Idempotency-Key', context.idempotencyKey);
  }

  if (context.ifMatch) {
    headers.set('If-Match', context.ifMatch);
  }

  if (context.ifNoneMatch) {
    headers.set('If-None-Match', context.ifNoneMatch);
  }

  return headers;
}
