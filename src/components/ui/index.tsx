import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('bg-[#FAF9F6] rounded-[24px] border border-[#D5DDC6] shadow-sm', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 lg:p-8 pb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('font-semibold text-[11px] tracking-widest uppercase text-[#A5A58D]', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 lg:p-8 pt-0', className)} {...props}>
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
  const baseStyles = 'inline-flex items-center justify-center rounded-full font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 uppercase tracking-widest text-[#F5F2ED]';
  
  const variants = {
    primary: 'bg-[#6B705C] text-white hover:bg-[#5A5E4D]',
    secondary: 'bg-[#D5DDC6] text-[#3A3D32] hover:bg-[#B7B7A4]',
    outline: 'border border-[#A5A58D] bg-transparent hover:bg-[#E3D5CA] text-[#3A3D32]',
    ghost: 'hover:bg-[#E3D5CA] text-[#3A3D32]',
    danger: 'bg-[#A5A58D] text-white hover:bg-[#6B705C]',
  };

  const sizes = {
    default: 'h-10 px-6 py-2 text-[10px]',
    sm: 'h-9 px-4 text-[10px]',
    lg: 'h-14 px-8 min-h-[48px] text-[11px]',
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
    default: 'bg-[#E3D5CA] text-[#4A4A3F]',
    proficient: 'bg-[#6B705C] text-white',
    basic: 'bg-[#DDBEA9] text-[#4A4A3F]',
  };

  return (
    <div className={cn('inline-flex items-center rounded-full px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest', variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
