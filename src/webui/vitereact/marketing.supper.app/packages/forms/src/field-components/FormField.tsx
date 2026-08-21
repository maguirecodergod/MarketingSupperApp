import React from 'react';

export interface FieldErrorProps {
  error?: string | null;
  id?: string;
}

export function FieldError({ error, id }: FieldErrorProps) {
  if (!error) return null;
  return (
    <p id={id} className="text-xs font-medium text-red-600 mt-1" role="alert">
      {error}
    </p>
  );
}

export interface FieldDescriptionProps {
  description?: string | null;
  id?: string;
}

export function FieldDescription({ description, id }: FieldDescriptionProps) {
  if (!description) return null;
  return (
    <p id={id} className="text-xs text-gray-500 mt-1">
      {description}
    </p>
  );
}

export interface FormFieldProps {
  label?: string;
  name: string;
  error?: string | null;
  description?: string;
  required?: boolean;
  children: (props: {
    id: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
    name: string;
  }) => React.ReactNode;
}

export function FormField({
  label,
  name,
  error,
  description,
  required,
  children,
}: FormFieldProps) {
  const id = `field-${name}`;
  const errorId = error ? `${id}-error` : undefined;
  const descId = description ? `${id}-desc` : undefined;
  const describedBy = [errorId, descId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-900">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children({
        id,
        name,
        'aria-describedby': describedBy,
        'aria-invalid': Boolean(error),
      })}
      <FieldDescription id={descId} description={description} />
      <FieldError id={errorId} error={error} />
    </div>
  );
}
