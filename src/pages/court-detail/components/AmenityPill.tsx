import type { Amenity } from '../types'

const LABEL: Record<Amenity, string> = {
  parking: '주차',
  shower: '샤워',
  lighting: '조명',
  locker: '락커',
  rental: '대여',
  cafeteria: '카페',
}

interface Props {
  amenity: Amenity
}

export function AmenityPill({ amenity }: Props) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200">
      {LABEL[amenity]}
    </span>
  )
}
