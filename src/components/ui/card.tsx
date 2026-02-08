import * as React from 'react'
import { cn } from '../../lib/utils'

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function Card(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('rounded-2xl border border-slate-200 bg-white shadow-sm', className)} {...props} />
})

export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-1.5 p-4', props.className)} {...props} />
}
export function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold leading-none tracking-tight', props.className)} {...props} />
}
export function CardDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-slate-600', props.className)} {...props} />
}
export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-4 pt-0', props.className)} {...props} />
}
