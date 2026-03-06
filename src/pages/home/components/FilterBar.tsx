import type { AmenityCode } from '../../../types/domain'
import type { Filters } from '../hooks/useFilteredCourts'

interface Props {
  filters: Filters
  sidoOptions: string[]
  sigunguOptions: string[]
  onChange: (updates: Partial<Filters>) => void
}

const AMENITY_LABEL: Record<string, string> = {
  all: '편의시설 전체',
  parking: '주차',
  shower: '샤워',
  lighting: '조명',
  locker: '락커',
  rental: '대여',
  cafeteria: '카페',
}

export function FilterBar({ filters, onChange, sidoOptions, sigunguOptions }: Props) {
  const indoorButtons: { key: Filters['indoor']; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'indoor', label: '실내' },
    { key: 'outdoor', label: '야외' },
  ]

  const sortOptions: { key: Filters['sort']; label: string }[] = [
    { key: 'popular', label: '인기순' },
    { key: 'priceAsc', label: '가격 낮은순' },
    { key: 'priceDesc', label: '가격 높은순' },
    { key: 'courts', label: '코트수 많은순' },
  ]

  const amenityOptions: AmenityCode[] = ['parking', 'shower', 'lighting', 'locker', 'rental', 'cafeteria']

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-md shadow-emerald-50">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">코트 탐색</div>
        <button
          className="rounded-full bg-transparent px-3 py-1 text-xs font-semibold text-emerald-600 transition hover:text-emerald-700"
          onClick={() =>
            onChange({
              search: '',
              regionSido: '',
              regionSigungu: '',
              indoor: 'all',
              amenity: 'all',
              sort: 'popular',
            })
          }
        >
          초기화
        </button>
      </div>

      <div className="grid gap-3">
        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-slate-500">검색</label>
          <input
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="테니스장명, 지역, 주소 검색"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 ring-1 ring-emerald-50 focus:border-emerald-300 focus:outline-none focus:ring-emerald-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-slate-500">지역(시/도)</label>
            <select
              value={filters.regionSido}
              onChange={(e) => onChange({ regionSido: e.target.value, regionSigungu: '' })}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-emerald-50 focus:border-emerald-300 focus:outline-none focus:ring-emerald-200"
            >
              <option value="">전체</option>
              {sidoOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-slate-500">시/군/구</label>
            <select
              value={filters.regionSigungu}
              onChange={(e) => onChange({ regionSigungu: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-emerald-50 focus:border-emerald-300 focus:outline-none focus:ring-emerald-200"
            >
              <option value="">전체</option>
              {sigunguOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">실내/야외</p>
          <div className="flex gap-2">
            {indoorButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => onChange({ indoor: btn.key })}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ring-1 ${
                  filters.indoor === btn.key
                    ? 'bg-emerald-500 text-white ring-emerald-300'
                    : 'bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">편의시설</p>
          <select
            value={filters.amenity}
            onChange={(e) => onChange({ amenity: e.target.value as AmenityCode | 'all' })}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-emerald-50 focus:border-emerald-300 focus:outline-none focus:ring-emerald-200"
          >
            <option value="all">{AMENITY_LABEL.all}</option>
            {amenityOptions.map((key) => (
              <option key={key} value={key}>
                {AMENITY_LABEL[key]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">정렬</p>
          <select
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as Filters['sort'] })}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-emerald-50 focus:border-emerald-300 focus:outline-none focus:ring-emerald-200"
          >
            {sortOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
