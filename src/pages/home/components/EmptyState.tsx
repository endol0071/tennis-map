import { Link } from 'react-router-dom'

interface Props {
  onReset: () => void
}

export function EmptyState({ onReset }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-emerald-300/60 bg-white p-10 text-center text-slate-700 shadow-sm">
      <p className="text-lg font-semibold text-slate-900">조건에 맞는 코트가 없습니다.</p>
      <p className="mt-2 text-sm text-slate-500">필터를 완화하거나 다른 지역을 선택해보세요.</p>
      <button
        onClick={onReset}
        className="mt-4 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:brightness-110"
      >
        필터 초기화
      </button>
      <div className="mt-3">
        <Link
          to="/submit"
          className="inline-flex rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
        >
          찾는 코트 제보하기
        </Link>
      </div>
    </div>
  )
}
