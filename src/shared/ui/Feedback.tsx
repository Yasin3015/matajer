import React from 'react';
import { AlertTriangle, RefreshCw, PackageOpen } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
    <div className="w-14 h-14 rounded-2xl bg-dangerLight flex items-center justify-center">
      <AlertTriangle size={28} className="text-danger" />
    </div>
    <div>
      <p className="text-textPrimary font-semibold">Something went wrong</p>
      <p className="text-sm text-textSecondary mt-1 max-w-xs">{message}</p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="btn-secondary flex items-center gap-2 text-sm"
      >
        <RefreshCw size={14} />
        Try again
      </button>
    )}
  </div>
);

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'Get started by adding your first item.',
  icon,
  action,
}) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
    {icon && (
      <div className="w-14 h-14 rounded-2xl bg-primaryLight flex items-center justify-center text-primary">
        {icon}
      </div>
    )}
    <div>
      <p className="text-textPrimary font-semibold">{title}</p>
      <p className="text-sm text-textSecondary mt-1 max-w-xs">{description}</p>
    </div>
    {action}
  </div>
);

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; tone?: 'default' | 'onLight' }> = ({
  size = 'md',
  tone = 'default',
}) => {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center py-8">
      <span
        className={`${s[size]} border-2 border-primary border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
};
