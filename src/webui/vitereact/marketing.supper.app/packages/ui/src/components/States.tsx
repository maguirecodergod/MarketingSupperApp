import React from 'react';
import { Button } from './Button.js';
import { Spinner } from './Input.js';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Loading data...', className = '' }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <Spinner size="lg" className="mb-4" />
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{message}</p>
    </div>
  );
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50/50 dark:bg-gray-900/50 ${className}`}>
      {icon && <div className="mb-3 text-gray-400 dark:text-gray-500">{icon}</div>}
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button onClick={onAction} variant="outline" size="sm">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Failed to load content',
  message = 'An unexpected error occurred while communicating with the server.',
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-lg bg-red-50/50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 ${className}`}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-red-900 dark:text-red-200">{title}</h3>
      <p className="mt-1 text-sm text-red-700 dark:text-red-300 max-w-md">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button onClick={onRetry} variant="outline" size="sm" className="border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/50">
            Retry Request
          </Button>
        </div>
      )}
    </div>
  );
}
