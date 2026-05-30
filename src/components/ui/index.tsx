import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('bg-white rounded border border-[#e7eeff] shadow-sm', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-4 lg:p-6 pb-2', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('font-semibold text-lg tracking-tight text-[#111c2d]', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-4 lg:p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}

export function Button({ 
  className, variant = 'primary', size = 'default', children, ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}) {
  const baseStyles = 'inline-flex items-center justify-center rounded font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-[#003262] text-white hover:bg-[#001d3d]',
    secondary: 'bg-[#f0f3ff] text-[#003262] hover:bg-[#e7eeff]',
    outline: 'border border-[#737780] bg-transparent hover:bg-[#f0f3ff] text-[#111c2d]',
    ghost: 'hover:bg-[#f0f3ff] text-[#111c2d]',
    danger: 'bg-[#ba1a1a] text-white hover:bg-[#93000a]',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded px-3',
    lg: 'h-12 rounded px-8 text-base min-h-[48px]',
    icon: 'h-10 w-10 min-h-[48px] min-w-[48px]',
  };

  return (
    <button className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function Badge({ className, variant = 'default', children, ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'proficient' | 'basic' }) {
  
  const variants = {
    default: 'bg-[#f0f3ff] text-[#111c2d]',
    proficient: 'bg-[#003262] text-white',
    basic: 'bg-[#d5e3fc] text-[#0d1c2e]',
  };

  return (
    <div className={cn('inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium', variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
