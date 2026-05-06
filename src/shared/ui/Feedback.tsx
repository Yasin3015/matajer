import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
    <div className="w-14 h-14 rounded-2xl bg-red-900/30 flex items-center justify-center">
      <AlertTriangle size={28} className="text-red-400" />
    </div>
    <div>
      <p className="text-slate-300 font-medium">Error</p>
      <p className="text-sm text-slate-500 mt-1 max-w-xs">{message}</p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="btn-secondary flex items-center gap-2 text-sm"
      >
        <RefreshCw size={14} />
        Retry
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
      <div className="w-14 h-14 rounded-2xl bg-surface-hover flex items-center justify-center text-slate-400">
        {icon}
      </div>
    )}
    <div>
      <p className="text-slate-300 font-medium">{title}</p>
      <p className="text-sm text-slate-500 mt-1 max-w-xs">{description}</p>
    </div>
    {action}
  </div>
);

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center py-8">
      <span className={`${s[size]} border-2 border-brand-500 border-t-transparent rounded-full animate-spin`} />
    </div>
  );
};
