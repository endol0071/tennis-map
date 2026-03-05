import type { Submission } from '../types'

const statusColor: Record<Submission['status'], string> = {
  pending: 'bg-amber-100 text-amber-800 ring-amber-200',
  approved: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  rejected: 'bg-rose-100 text-rose-800 ring-rose-200',
}

interface Props {
  submission: Submission
  onChangeStatus?: (id: string, status: Submission['status']) => void
  updating?: boolean
}

export function SubmissionRow({ submission, onChangeStatus, updating }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 ring-1 ring-emerald-50 shadow-sm">
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
          {submission.reservationType === 'public'
            ? '공공예약'
            : submission.reservationType === 'phone'
            ? '전화'
            : submission.reservationType === 'app'
            ? '앱'
            : submission.reservationType === 'lottery'
            ? '추첨'
            : '현장'}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="space-y-1">
          <p className="text-slate-700">{submission.submitter}</p>
          <p>{submission.submittedAt}</p>
        </div>
        <p className="text-right text-[11px]">{submission.note ?? '비고 없음'}</p>
      </div>

      {onChangeStatus && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={updating || submission.status === 'approved'}
            onClick={() => onChangeStatus(submission.id, 'approved')}
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${
              submission.status === 'approved'
                ? 'bg-emerald-500 text-white ring-emerald-300'
                : 'bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200'
            } ${updating ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            승인
          </button>
          <button
            type="button"
            disabled={updating || submission.status === 'pending'}
            onClick={() => onChangeStatus(submission.id, 'pending')}
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${
              submission.status === 'pending'
                ? 'bg-amber-100 text-amber-900 ring-amber-200'
                : 'bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200'
            } ${updating ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            대기
          </button>
          <button
            type="button"
            disabled={updating || submission.status === 'rejected'}
            onClick={() => onChangeStatus(submission.id, 'rejected')}
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${
              submission.status === 'rejected'
                ? 'bg-rose-100 text-rose-800 ring-rose-200'
                : 'bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200'
            } ${updating ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            반려
          </button>
          {updating && (
            <span className="text-[11px] text-slate-500">저장 중...</span>
          )}
        </div>
      )}
    </div>
  )
}
