import * as React from 'react'
import { cn } from '../../lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'muted'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        variant === 'default' && 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200',
        variant === 'outline' && 'border border-slate-200 text-slate-700',
        variant === 'muted' && 'bg-slate-100 text-slate-600',
        className,
      )}
      {...props}
    />
  )
}
