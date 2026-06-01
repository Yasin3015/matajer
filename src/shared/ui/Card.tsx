import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick, hover }) => (
  <div
    className={clsx(
      'card animate-fade-in',
      hover && 'cursor-pointer hover:border-primary/30 transition-all duration-200',
      className
    )}
    onClick={onClick}
  >
    {children}
  </div>
);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeType = 'neutral',
  color = 'primary',
}) => {
  const iconColors = {
    primary: 'bg-primaryLight text-primary',
    success: 'bg-successLight text-success',
    warning: 'bg-amber-50 text-amber-600',
    danger:  'bg-dangerLight text-danger',
  };
  const changeColors = {
    positive: 'text-success',
    negative: 'text-danger',
    neutral:  'text-textSecondary',
  };

  return (
    <Card className="flex items-start gap-4">
      <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', iconColors[color])}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-textSecondary">{title}</p>
        <p className="text-2xl font-bold text-textPrimary mt-0.5">{value}</p>
        {change && <p className={clsx('text-xs mt-1 font-medium', changeColors[changeType])}>{change}</p>}
      </div>
    </Card>
  );
};
