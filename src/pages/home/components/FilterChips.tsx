import { Filter } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { ScrollArea } from '../../../components/ui/scroll-area'
import type { Filters } from '../hooks/useFilteredCourts'

interface Props {
  filters: Filters
  onOpen: () => void
}

const amenityLabel: Record<string, string> = {
  parking: '주차',
  shower: '샤워',
  lighting: '조명',
  locker: '락커',
  rental: '대여',
  cafeteria: '카페',
}

const sortLabel: Record<Filters['sort'], string> = {
  popular: '인기순',
  priceAsc: '가격 낮은순',
  priceDesc: '가격 높은순',
  courts: '코트수 많은순',
}

export function FilterChips({ filters, onOpen }: Props) {
  const summaryChips = [
    filters.regionSido && `${filters.regionSido}${filters.regionSigungu ? ` · ${filters.regionSigungu}` : ''}`,
    filters.indoor !== 'all' &&
      (filters.indoor === 'indoor' ? '실내만' : filters.indoor === 'outdoor' ? '야외만' : '전체'),
    filters.amenity !== 'all' && `편의: ${amenityLabel[filters.amenity] ?? filters.amenity}`,
    `정렬: ${sortLabel[filters.sort]}`,
  ].filter(Boolean) as string[]

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 px-0.5 pt-1 pb-1">
        <Button variant="outline" size="sm" onClick={onOpen} className="gap-2 rounded-full">
          <Filter className="h-4 w-4" />
          필터
        </Button>
        {summaryChips.map((chip) => (
          <Badge key={chip} className="whitespace-nowrap bg-slate-100 text-slate-700">
            {chip}
          </Badge>
        ))}
      </div>
    </ScrollArea>
  )
}
