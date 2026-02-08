import { useMemo, useState } from 'react'
import { Filter } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { COURTS } from './data/courts'
import type { Filters } from './hooks/useFilteredCourts'
import { useFilteredCourts } from './hooks/useFilteredCourts'
import { CourtCard } from './components/CourtCard'
import { EmptyState } from './components/EmptyState'
import { FilterChips } from './components/FilterChips'
import { FilterModal } from './components/FilterModal'

const defaultFilters: Filters = {
  search: '',
  regionSido: '',
  regionSigungu: '',
  indoor: 'all',
  amenity: 'all',
  sort: 'popular',
}

function HomePage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [open, setOpen] = useState(false)
  const { filtered } = useFilteredCourts(COURTS, filters)

  const sidoOptions = useMemo(
    () => Array.from(new Set(COURTS.map((court) => court.regionSido))),
    [],
  )

  const sigunguOptions = useMemo(() => {
    if (!filters.regionSido) return []
    return Array.from(
      new Set(
        COURTS.filter((court) => court.regionSido === filters.regionSido).map((court) => court.regionSigungu),
      ),
    )
  }, [filters.regionSido])

  const handleChange = (updates: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-lime-400 text-lg font-semibold text-slate-900 shadow-lg shadow-emerald-400/30">
          TM
        </div>
        <input
          value={filters.search}
          onChange={(e) => handleChange({ search: e.target.value })}
          placeholder="테니스장명, 지역, 주소 검색"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 ring-1 ring-emerald-50 focus:border-emerald-300 focus:outline-none focus:ring-emerald-200"
        />
        <Button variant="default" size="lg" onClick={() => setOpen(true)} aria-label="필터 열기" className="shrink-0">
          <Filter className="h-5 w-5" />
        </Button>
      </div>

      <FilterChips filters={filters} onOpen={() => setOpen(true)} />

      {filtered.length === 0 ? (
        <EmptyState onReset={() => setFilters(defaultFilters)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>
      )}

      <FilterModal
        open={open}
        onOpenChange={setOpen}
        filters={filters}
        onChange={handleChange}
        onReset={() => setFilters(defaultFilters)}
        sidoOptions={sidoOptions}
        sigunguOptions={sigunguOptions}
      />
    </div>
  )
}

export default HomePage
