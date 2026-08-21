import type { components } from '@enterprise/api-contracts';

export type FieldError = components['schemas']['FieldError'];
export type ProblemDetails = components['schemas']['ProblemDetails'];

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly correlationId: string;
  readonly requestId?: string;
  readonly retryable: boolean;
  readonly fieldErrors?: FieldError[];
  readonly raw?: unknown;

  constructor(options: {
    message: string;
    status: number;
    code: string;
    correlationId: string;
    requestId?: string;
    retryable?: boolean;
    fieldErrors?: FieldError[];
    raw?: unknown;
  }) {
    super(options.message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.correlationId = options.correlationId;
    this.requestId = options.requestId;
    this.retryable = options.retryable ?? false;
    this.fieldErrors = options.fieldErrors;
    this.raw = options.raw;
  }
}

export class ValidationError extends ApiError {
  constructor(options: {
    message: string;
    correlationId: string;
    fieldErrors?: FieldError[];
    raw?: unknown;
  }) {
    super({
      message: options.message,
      status: 422,
      code: 'VALIDATION_ERROR',
      correlationId: options.correlationId,
      retryable: false,
      fieldErrors: options.fieldErrors,
      raw: options.raw,
    });
    this.name = 'ValidationError';
  }
}

export class AuthError extends ApiError {
  constructor(options: {
    message: string;
    status: 401 | 403;
    code?: string;
    correlationId: string;
    raw?: unknown;
  }) {
    super({
      message: options.message,
      status: options.status,
      code: options.code ?? (options.status === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN'),
      correlationId: options.correlationId,
      retryable: false,
      raw: options.raw,
    });
    this.name = 'AuthError';
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network connection failed', correlationId = '') {
    super({
      message,
      status: 0,
      code: 'NETWORK_ERROR',
      correlationId: correlationId || (typeof crypto !== 'undefined' ? crypto.randomUUID() : 'net-err'),
      retryable: true,
    });
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends ApiError {
  constructor(timeoutMs: number, correlationId = '') {
    super({
      message: `Request timed out after ${timeoutMs}ms`,
      status: 408,
      code: 'TIMEOUT_ERROR',
      correlationId: correlationId || (typeof crypto !== 'undefined' ? crypto.randomUUID() : 'timeout-err'),
      retryable: true,
    });
    this.name = 'TimeoutError';
  }
}

export class RateLimitError extends ApiError {
  readonly retryAfterSeconds: number;

  constructor(options: {
    message?: string;
    correlationId: string;
    retryAfterSeconds: number;
    raw?: unknown;
  }) {
    super({
      message: options.message || `Rate limit exceeded. Please retry after ${options.retryAfterSeconds}s`,
      status: 429,
      code: 'RATE_LIMITED',
      correlationId: options.correlationId,
      retryable: true,
      raw: options.raw,
    });
    this.name = 'RateLimitError';
    this.retryAfterSeconds = options.retryAfterSeconds;
  }
}

export class ConflictError extends ApiError {
  constructor(options: {
    message: string;
    correlationId: string;
    raw?: unknown;
  }) {
    super({
      message: options.message,
      status: 409,
      code: 'CONFLICT',
      correlationId: options.correlationId,
      retryable: false,
      raw: options.raw,
    });
    this.name = 'ConflictError';
  }
}

export class UnknownError extends ApiError {
  constructor(message: string, correlationId = '', raw?: unknown) {
    super({
      message,
      status: 500,
      code: 'UNKNOWN_ERROR',
      correlationId: correlationId || (typeof crypto !== 'undefined' ? crypto.randomUUID() : 'unknown-err'),
      retryable: false,
      raw,
    });
    this.name = 'UnknownError';
  }
}
