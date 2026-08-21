export interface RequestContext {
  correlationId: string;
  requestId: string;
  traceParent?: string;
  idempotencyKey?: string;
  ifMatch?: string;
  ifNoneMatch?: string;
}

export function createRequestContext(overrides?: Partial<RequestContext>): RequestContext {
  const correlationId = overrides?.correlationId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `corr-${Date.now()}`);
  const requestId = overrides?.requestId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `req-${Date.now()}`);

  return {
    correlationId,
    requestId,
    traceParent: overrides?.traceParent,
    idempotencyKey: overrides?.idempotencyKey,
    ifMatch: overrides?.ifMatch,
    ifNoneMatch: overrides?.ifNoneMatch,
  };
}
