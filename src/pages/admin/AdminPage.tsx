import { useMemo, useState } from 'react'
import { SUBMISSIONS } from './data/submissions'
import { SubmissionRow } from './components/SubmissionRow'
import type { Submission } from './types'

const filterButtons: { key: 'all' | Submission['status']; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'pending', label: '대기' },
  { key: 'approved', label: '승인' },
  { key: 'rejected', label: '반려' },
]

function AdminPage() {
  const [status, setStatus] = useState<'all' | Submission['status']>('all')

  const filtered = useMemo(
    () => (status === 'all' ? SUBMISSIONS : SUBMISSIONS.filter((item) => item.status === status)),
    [status],
  )

  return (
    <div className="space-y-8 pb-16">
      <section className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-lg shadow-emerald-50">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Admin · 검수</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">제보 검수 대시보드</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          실제 운영 시 승인/반려/병합 플로우를 여기에 연결하면 됩니다. 현재는 목데이터와 필터만 동작하는 상태입니다.
        </p>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setStatus(btn.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ring-1 ${
              status === btn.key
                ? 'bg-emerald-500 text-white ring-emerald-300'
                : 'bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200'
            }`}
          >
            {btn.label}
          </button>
        ))}
        <span className="rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-200">
          총 {filtered.length}건
        </span>
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <SubmissionRow key={item.id} submission={item} />
        ))}
      </div>
    </div>
  )
}

export default AdminPage
