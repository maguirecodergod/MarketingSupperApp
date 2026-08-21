import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../lib/utils.js';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    const baseStyles = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const variantStyles = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm focus-visible:ring-blue-500',
      destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm focus-visible:ring-red-500',
      outline: 'border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:ring-blue-500',
      secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 focus-visible:ring-gray-500',
      ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white focus-visible:ring-gray-500',
      link: 'text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline focus-visible:ring-blue-500',
    };

    const sizeStyles = {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-md px-8 text-base',
      icon: 'h-9 w-9',
    };

    return (
      <Comp
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>{children}</span>
          </span>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';
