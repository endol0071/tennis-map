import { Link } from 'react-router-dom'
import type { Court } from '../types'
import { formatReservationType } from '../../../lib/reservation'

interface Props {
  court: Court
}

const PLACEHOLDER_IMAGE = 'https://placehold.co/1200x800?text=Tennis+Court'

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
      {children}
    </span>
  )
}

export function CourtCard({ court }: Props) {
  const primaryImage = court.images[0]?.trim() || PLACEHOLDER_IMAGE

  return (
    <Link
      to={`/courts/${court.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-emerald-50 ring-1 ring-emerald-50 transition hover:-translate-y-1 hover:ring-emerald-200"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={primaryImage}
          alt={court.name}
          onError={(event) => {
            if (event.currentTarget.src !== PLACEHOLDER_IMAGE) {
              event.currentTarget.src = PLACEHOLDER_IMAGE
            }
          }}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          {court.isIndoorAvailable && <Badge>실내</Badge>}
          {court.isOutdoorAvailable && <Badge>야외</Badge>}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[11px] text-white">
          <span className="rounded-full bg-black/50 px-3 py-1 ring-1 ring-black/10">
            {court.regionSido} · {court.regionSigungu}
          </span>
          <span className="rounded-full bg-black/50 px-3 py-1 ring-1 ring-black/10">
            {court.courtSurface ?? '코트 정보'} · {court.courtsTotal ?? court.courtsIndoor + court.courtsOutdoor}면
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{court.name}</h3>
            <p className="text-sm text-slate-500">{court.addressRoad}</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            {court.popularity ?? 0} 인기
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-slate-700">
          <span className="rounded-lg bg-slate-100 px-3 py-1 ring-1 ring-slate-200">
            실내 {court.courtsIndoor} · 야외 {court.courtsOutdoor}
          </span>
          <span className="rounded-lg bg-slate-100 px-3 py-1 ring-1 ring-slate-200">
            {formatReservationType(court.reservationType)}
          </span>
          {court.priceMin && (
            <span className="rounded-lg bg-slate-100 px-3 py-1 ring-1 ring-slate-200">
              ₩{court.priceMin.toLocaleString()}~{court.priceMax?.toLocaleString() ?? '?'}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {court.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity.code}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200"
            >
              {amenity.name}
            </span>
          ))}
          {court.amenities.length > 4 && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
              +{court.amenities.length - 4}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
