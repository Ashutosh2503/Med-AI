import React from 'react';
import { SeverityLevel } from '../../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  const variantStyles = {
    default: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full whitespace-nowrap tracking-wide uppercase ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: SeverityLevel; className?: string }> = ({
  severity,
  className = '',
}) => {
  const config = {
    low: { label: 'Low Severity', variant: 'success' as const },
    moderate: { label: 'Moderate Caution', variant: 'warning' as const },
    high: { label: 'High Priority', variant: 'danger' as const },
    emergency: { label: 'Immediate Emergency', variant: 'danger' as const },
  }[severity] || { label: severity, variant: 'neutral' as const };

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};
