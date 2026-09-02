import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export interface NoticeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'warning' | 'danger' | 'success';
  title?: string;
  children: React.ReactNode;
}

export const Notice: React.FC<NoticeProps> = ({
  variant = 'info',
  title,
  children,
  className = '',
  ...props
}) => {
  const configs = {
    info: {
      bg: 'bg-sky-50 border-sky-200 text-sky-900',
      icon: <Info className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />,
    },
    danger: {
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />,
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />,
    },
  };

  const current = configs[variant];

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-xl border ${current.bg} ${className}`}
      {...props}
    >
      {current.icon}
      <div className="flex-1 text-sm leading-relaxed">
        {title && <h4 className="font-semibold mb-1 text-slate-900">{title}</h4>}
        <div>{children}</div>
      </div>
    </div>
  );
};
