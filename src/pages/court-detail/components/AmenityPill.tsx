import type { Amenity } from '../types'

interface Props {
  amenity: Amenity
}

export function AmenityPill({ amenity }: Props) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200">
      {amenity.name}
    </span>
  )
}
