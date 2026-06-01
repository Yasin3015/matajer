import React from 'react';
import clsx from 'clsx';

type BadgeVariant = 'green' | 'yellow' | 'red' | 'blue' | 'slate';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'slate', children, className }) => (
  <span className={clsx(`badge-${variant}`, 'badge', className)}>{children}</span>
);

// Convenience helpers
export const statusBadge = (status: string): BadgeVariant => {
  const map: Record<string, BadgeVariant> = {
    active: 'green', delivered: 'green', paid: 'green',
    pending: 'yellow', processing: 'yellow', invited: 'yellow', confirmed: 'blue',
    cancelled: 'red', suspended: 'red', archived: 'red',
    shipped: 'blue', draft: 'slate',
  };
  return map[status] ?? 'slate';
};
