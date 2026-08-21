import * as React from 'react';
import { cn } from '../lib/utils.js';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus-visible:ring-blue-500',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-950 dark:text-gray-50 shadow-sm', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-semibold leading-none tracking-tight text-lg text-gray-900 dark:text-gray-100', className)} {...props}>{children}</h3>;
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-gray-500 dark:text-gray-400', className)} {...props}>{children}</p>;
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props}>{children}</div>;
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variantStyles = {
    default: 'border-transparent bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border-transparent bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700',
    destructive: 'border-transparent bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300',
    outline: 'text-gray-950 dark:text-gray-50 border-gray-300 dark:border-gray-700',
    success: 'border-transparent bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300',
    warning: 'border-transparent bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Spinner({ className, size = 'default' }: { className?: string; size?: 'sm' | 'default' | 'lg' }) {
  const sizeMap = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <svg className={cn('animate-spin text-blue-600 dark:text-blue-400', sizeMap[size], className)} viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  title?: string;
}

export function Alert({ className, variant = 'default', title, children, ...props }: AlertProps) {
  const styles = {
    default: 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-900',
    destructive: 'bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 border-red-200 dark:border-red-900',
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-900',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-900',
  };

  return (
    <div role="alert" className={cn('relative w-full rounded-lg border p-4 text-sm', styles[variant], className)} {...props}>
      {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
      <div className="text-sm [&_p]:leading-relaxed">{children}</div>
    </div>
  );
}
