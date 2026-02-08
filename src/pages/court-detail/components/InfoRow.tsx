interface Props {
  label: string
  value: string | React.ReactNode
}

export function InfoRow({ label, value }: Props) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
      <p className="text-slate-500">{label}</p>
      <div className="text-right font-semibold text-slate-900">{value}</div>
    </div>
  )
}
