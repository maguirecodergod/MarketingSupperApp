import React from 'react';
import { FormField } from './FormField.js';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  error?: string | null;
  description?: string;
}

export function TextField({
  label,
  name,
  error,
  description,
  required,
  className = '',
  ...props
}: TextFieldProps) {
  return (
    <FormField label={label} name={name} error={error} description={description} required={required}>
      {(fieldProps) => (
        <input
          {...fieldProps}
          {...props}
          required={required}
          className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100 ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
          } ${className}`}
        />
      )}
    </FormField>
  );
}

export interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  name: string;
  error?: string | null;
  description?: string;
}

export function TextareaField({
  label,
  name,
  error,
  description,
  required,
  className = '',
  ...props
}: TextareaFieldProps) {
  return (
    <FormField label={label} name={name} error={error} description={description} required={required}>
      {(fieldProps) => (
        <textarea
          {...fieldProps}
          {...props}
          required={required}
          className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100 ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
          } ${className}`}
        />
      )}
    </FormField>
  );
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  name: string;
  error?: string | null;
  description?: string;
  options: SelectOption[];
}

export function SelectField({
  label,
  name,
  error,
  description,
  options,
  required,
  className = '',
  ...props
}: SelectFieldProps) {
  return (
    <FormField label={label} name={name} error={error} description={description} required={required}>
      {(fieldProps) => (
        <select
          {...fieldProps}
          {...props}
          required={required}
          className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100 bg-white ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
          } ${className}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </FormField>
  );
}
