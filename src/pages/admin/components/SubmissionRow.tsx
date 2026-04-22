import type { Submission } from '../types'
import { formatReservationType } from '../../../lib/reservation'

const statusColor: Record<Submission['status'], string> = {
  pending: 'bg-amber-100 text-amber-800 ring-amber-200',
  approved: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  rejected: 'bg-rose-100 text-rose-800 ring-rose-200',
}

interface Props {
  submission: Submission
  onSelect?: (submission: Submission) => void
}

export function SubmissionRow({ submission, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(submission)}
      className="flex w-full flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left text-sm text-slate-700 ring-1 ring-emerald-50 shadow-sm transition hover:border-emerald-300 hover:ring-emerald-100"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">{submission.name}</p>
          <p className="text-xs text-slate-500">{submission.addressRoad}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${statusColor[submission.status]}`}
        >
          {submission.status.toUpperCase()}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">
          {submission.regionSido} · {submission.regionSigungu}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">
          {formatReservationType(submission.reservationType)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
        <div className="space-y-1">
          <p className="text-slate-700">{submission.submitter}</p>
          <p>{submission.submittedAt}</p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-[11px]">{submission.note ?? '비고 없음'}</p>
          <p className="font-semibold text-emerald-700">상세 확인</p>
        </div>
      </div>
    </button>
  )
}
