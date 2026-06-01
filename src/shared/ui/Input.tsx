import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'input',
              icon && 'pl-10',
              error && 'border-danger focus:shadow-none',
              className
            )}
            style={error ? { borderColor: '#BA1A1A', boxShadow: '0 0 0 3px rgba(186,26,26,0.15)' } : undefined}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-danger font-medium">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-textSecondary">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, id, className, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && <label htmlFor={selectId} className="label">{label}</label>}
        <select
          ref={ref}
          id={selectId}
          className={clsx('input select', error && 'border-danger', className)}
          style={error ? { borderColor: '#BA1A1A' } : undefined}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-white text-textPrimary">
              {o.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-xs text-danger font-medium">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const taId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && <label htmlFor={taId} className="label">{label}</label>}
        <textarea
          ref={ref}
          id={taId}
          rows={4}
          className={clsx('input resize-none', error && 'border-danger', className)}
          style={error ? { borderColor: '#BA1A1A', height: 'auto' } : { height: 'auto' }}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-danger font-medium">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
