import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import type { AmenityCode } from '../../../types/domain'
import type { Filters } from '../hooks/useFilteredCourts'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: Filters
  onChange: (updates: Partial<Filters>) => void
  onReset: () => void
  sidoOptions: string[]
  sigunguOptions: string[]
}

const amenityLabel: Record<string, string> = {
  parking: '주차',
  shower: '샤워',
  lighting: '조명',
  locker: '락커',
  rental: '대여',
  cafeteria: '카페',
}

const sortOptions: { key: Filters['sort']; label: string }[] = [
  { key: 'popular', label: '인기순' },
  { key: 'priceAsc', label: '가격 낮은순' },
  { key: 'priceDesc', label: '가격 높은순' },
  { key: 'courts', label: '코트수 많은순' },
]

export function FilterModal({ open, onOpenChange, filters, onChange, onReset, sidoOptions, sigunguOptions }: Props) {
  const indoorButtons: { key: Filters['indoor']; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'indoor', label: '실내' },
    { key: 'outdoor', label: '야외' },
  ]

  const amenityOptions: AmenityCode[] = ['parking', 'shower', 'lighting', 'locker', 'rental', 'cafeteria']

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-4">
        <DialogHeader className="text-left">
          <DialogTitle>필터</DialogTitle>
          <DialogDescription>조건을 선택해 테니스장을 좁혀보세요.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <label className="text-xs uppercase tracking-[0.15em] text-slate-500">지역</label>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={filters.regionSido}
              onChange={(e) => onChange({ regionSido: e.target.value, regionSigungu: '' })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
            >
              <option value="">시/도 전체</option>
              {sidoOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={filters.regionSigungu}
              onChange={(e) => onChange({ regionSigungu: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
            >
              <option value="">시/군/구 전체</option>
              {sigunguOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">실내/야외</p>
          <div className="grid grid-cols-3 gap-2">
            {indoorButtons.map((btn) => (
              <Button
                key={btn.key}
                variant={filters.indoor === btn.key ? 'default' : 'secondary'}
                size="sm"
                onClick={() => onChange({ indoor: btn.key })}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">편의시설</p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={filters.amenity === 'all' ? 'default' : 'secondary'}
              onClick={() => onChange({ amenity: 'all' })}
            >
              전체
            </Button>
            {amenityOptions.map((amenity) => (
              <Button
                key={amenity}
                size="sm"
                variant={filters.amenity === amenity ? 'default' : 'secondary'}
                onClick={() => onChange({ amenity })}
              >
                {amenityLabel[amenity]}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">정렬</p>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <Badge
                key={option.key}
                variant={filters.sort === option.key ? 'default' : 'muted'}
                className="cursor-pointer"
                onClick={() => onChange({ sort: option.key })}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" className="flex-1" onClick={onReset}>
            초기화
          </Button>
          <Button className="flex-1" onClick={() => onOpenChange(false)}>
            적용하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
