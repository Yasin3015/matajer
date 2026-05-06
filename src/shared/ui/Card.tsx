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
      hover && 'cursor-pointer hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-900/20 transition-all duration-200',
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
  color?: 'brand' | 'green' | 'yellow' | 'red';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, changeType = 'neutral', color = 'brand' }) => {
  const colors = {
    brand:  'from-brand-600/20 to-brand-800/10 text-brand-400',
    green:  'from-green-600/20 to-green-800/10 text-green-400',
    yellow: 'from-yellow-600/20 to-yellow-800/10 text-yellow-400',
    red:    'from-red-600/20 to-red-800/10 text-red-400',
  };
  const changeColors = { positive: 'text-green-400', negative: 'text-red-400', neutral: 'text-slate-400' };

  return (
    <Card className="flex items-start gap-4">
      <div className={clsx('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0', colors[color])}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
        {change && <p className={clsx('text-xs mt-1', changeColors[changeType])}>{change}</p>}
      </div>
    </Card>
  );
};
