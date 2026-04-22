import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Court, PriceDayType } from '../../types/domain'
import { AmenityPill } from './components/AmenityPill'
import { InfoRow } from './components/InfoRow'
import { fetchCourt } from '../../lib/api'
import { formatReservationType } from '../../lib/reservation'

const dayTypeLabel: Record<PriceDayType, string> = {
  all: '전체',
  weekday: '평일',
  weekend: '주말',
  holiday: '공휴일',
}

function formatSpaceLayouts(layouts: NonNullable<Court['courtLayouts']>, space: 'indoor' | 'outdoor') {
  const filtered = layouts.filter((layout) => layout.space === space)
  if (!filtered.length) return undefined

  return filtered
    .map((layout) => {
      const summary = [`${layout.count}면`, layout.surface]
      if (layout.price && layout.price > 0) {
        summary.push(`${dayTypeLabel[layout.dayType ?? 'all']} ${layout.price.toLocaleString()}원`)
      } else {
        summary.push('가격 정보 없음')
      }
      return summary.join(' · ')
    })
    .join(' / ')
}

function formatSpaceInfo(court: Court, space: 'indoor' | 'outdoor') {
  const fromLayouts = court.courtLayouts ? formatSpaceLayouts(court.courtLayouts, space) : undefined
  if (fromLayouts) return fromLayouts

  const count = space === 'indoor' ? court.courtsIndoor : court.courtsOutdoor
  if (count > 0) return `${count}면 · 바닥재/가격 정보 없음`
  return '0면'
}

function CourtDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/')
  }

  const {
    data: court,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['court', id],
    queryFn: () => fetchCourt(id ?? ''),
    enabled: Boolean(id),
    initialData: () => {
      const list = queryClient.getQueryData<Court[]>(['courts'])
      return list?.find((item) => item.id === id)
    },
  })

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-8 py-12 text-center text-rose-800 shadow-md">
        코트 상세 정보를 불러오지 못했습니다. 다시 시도해주세요.
      </div>
    )
  }

  if (!court) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-8 py-12 text-center text-slate-600 shadow-md">
        <p className="text-lg font-semibold text-slate-900">코트를 찾을 수 없습니다.</p>
        <p className="mt-2 text-sm text-slate-500">다시 목록으로 이동해 원하는 코트를 선택해주세요.</p>
        <Link
          to="/"
          className="mt-4 inline-flex rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:brightness-110"
        >
          목록으로
        </Link>
      </div>
    )
  }

  const photos = court.images.length ? court.images : ['https://placehold.co/1200x800?text=Tennis+Court']
  const totalCourts = court.courtsTotal ?? court.courtsIndoor + court.courtsOutdoor

  return (
    <div className="space-y-6 pb-16">
      <header className="-mx-4 -mt-4 border-b border-slate-200 bg-white">
        <div className="relative flex h-14 items-center px-4">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-lime-400 text-xs font-bold text-slate-900 shadow-sm">
              TM
            </div>
            <p className="text-lg font-bold text-slate-900">테니스맵</p>
          </div>

          <button
            type="button"
            onClick={handleGoBack}
            aria-label="뒤로가기"
            className="relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <div className="space-y-4">
        <div className="space-y-3">
          <div className="h-60 overflow-hidden rounded-2xl border border-slate-200">
            <img src={photos[0]} alt={court.name} className="h-full w-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {photos.slice(1, 3).map((photo, idx) => (
              <div key={idx} className="h-36 overflow-hidden rounded-2xl border border-slate-200">
                <img src={photo} alt={`${court.name} preview ${idx + 2}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md shadow-emerald-50 ring-1 ring-emerald-50">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">코트 정보</p>
            <div className="mt-3 grid gap-2">
              <InfoRow label="코트명" value={court.name} />
              <InfoRow label="주소" value={court.addressRoad} />
              <InfoRow label="지역" value={`${court.regionSido} · ${court.regionSigungu}`} />
              <InfoRow label="실내 코트" value={formatSpaceInfo(court, 'indoor')} />
              <InfoRow label="야외 코트" value={formatSpaceInfo(court, 'outdoor')} />
              <InfoRow label="총 코트" value={`${totalCourts}면`} />
              <InfoRow label="코트 설명" value={court.description ?? '미입력'} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md shadow-emerald-50 ring-1 ring-emerald-50">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">예약 & 연락</p>
            <div className="mt-3 grid gap-2">
              <InfoRow label="예약 방법" value={formatReservationType(court.reservationType)} />
              {court.reservationUrl && (
                <InfoRow
                  label="예약 링크"
                  value={
                    <a
                      href={court.reservationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 underline underline-offset-2"
                    >
                      예약 페이지 이동
                    </a>
                  }
                />
              )}
              {court.phone && <InfoRow label="전화" value={court.phone} />}
              {court.naverMapUrl && (
                <InfoRow
                  label="네이버 지도"
                  value={
                    <a
                      href={court.naverMapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 underline underline-offset-2"
                    >
                      지도 열기
                    </a>
                  }
                />
              )}
            </div>
          </div>

          {court.amenities.length ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md shadow-emerald-50 ring-1 ring-emerald-50">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">편의시설</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {court.amenities.map((amenity, index) => (
                  <AmenityPill key={`${amenity.code}-${index}`} amenity={amenity} />
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">정보가 다르거나 누락됐나요?</p>
            <p className="mt-1 text-slate-500">
              예약 방식, 가격, 편의시설이 실제와 다르면 제보로 알려주세요.
            </p>
            <Link
              to="/submit"
              className="mt-3 inline-flex rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:brightness-110"
            >
              정보 수정 제보하기
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}

export default CourtDetailPage
