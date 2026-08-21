import { ApiError, ValidationError } from '@enterprise/api';

export interface FormErrorMapping {
  fieldErrors: Record<string, string>;
  globalError?: string;
}

export function mapApiErrorToForm(error: unknown): FormErrorMapping {
  if (error instanceof ValidationError && error.fieldErrors) {
    const fieldErrors: Record<string, string> = {};
    for (const fe of error.fieldErrors) {
      if (fe.field) {
        fieldErrors[fe.field] = fe.message;
      }
    }
    return {
      fieldErrors,
      globalError: Object.keys(fieldErrors).length === 0 ? error.message : undefined,
    };
  }

  if (error instanceof ApiError) {
    if (error.fieldErrors && error.fieldErrors.length > 0) {
      const fieldErrors: Record<string, string> = {};
      for (const fe of error.fieldErrors) {
        if (fe.field) {
          fieldErrors[fe.field] = fe.message;
        }
      }
      return { fieldErrors, globalError: undefined };
    }
    return {
      fieldErrors: {},
      globalError: error.message,
    };
  }

  if (error instanceof Error) {
    return {
      fieldErrors: {},
      globalError: error.message,
    };
  }

  return {
    fieldErrors: {},
    globalError: 'An unexpected error occurred during form submission',
  };
}
