import { Link, useParams } from 'react-router-dom'
import { COURT_DETAIL_DATA } from './data/courts'
import { AmenityPill } from './components/AmenityPill'
import { InfoRow } from './components/InfoRow'

const reservationLabel: Record<string, string> = {
  public: '공공예약',
  phone: '전화',
  app: '앱',
  onsite: '현장',
  lottery: '추첨',
}

function CourtDetailPage() {
  const { id } = useParams()
  const court = COURT_DETAIL_DATA.find((item) => item.id === id)

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

  return (
    <div className="space-y-10 pb-16">
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <Link to="/" className="text-xs uppercase tracking-[0.3em] text-emerald-600 hover:text-emerald-700">
            목록으로
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">{court.name}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">
              {court.regionSido} · {court.regionSigungu}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 ring-1 ring-emerald-200">
              {reservationLabel[court.reservationType]}
            </span>
            {court.courtSurface && (
              <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">{court.courtSurface}</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {court.naverMapUrl && (
            <a
              href={court.naverMapUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-400"
            >
              네이버 지도 열기
            </a>
          )}
          {court.phone && (
            <a
              href={`tel:${court.phone}`}
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:brightness-110"
            >
              전화 걸기
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
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
              <InfoRow label="실내 코트" value={`${court.courtsIndoor}면`} />
              <InfoRow label="야외 코트" value={`${court.courtsOutdoor}면`} />
              <InfoRow label="총 코트" value={`${court.courtsTotal ?? court.courtsIndoor + court.courtsOutdoor}면`} />
              {court.priceType && (
                <InfoRow
                  label="가격"
                  value={
                    court.priceMin
                      ? `₩${court.priceMin.toLocaleString()}~${court.priceMax?.toLocaleString() ?? '?'}/${court.priceType}`
                      : court.priceNote ?? '가격 정보 없음'
                  }
                />
              )}
              {court.priceNote && <InfoRow label="가격 비고" value={court.priceNote} />}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md shadow-emerald-50 ring-1 ring-emerald-50">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">예약 & 연락</p>
            <div className="mt-3 grid gap-2">
              <InfoRow label="예약 방법" value={reservationLabel[court.reservationType]} />
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
              <InfoRow label="주소" value={court.addressRoad} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md shadow-emerald-50 ring-1 ring-emerald-50">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">편의시설</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {court.amenities.length ? (
                court.amenities.map((amenity) => <AmenityPill key={amenity} amenity={amenity} />)
              ) : (
                <span className="text-sm text-slate-500">등록된 편의시설 정보가 없습니다.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-green-50 px-8 py-6 text-sm text-slate-700 ring-1 ring-emerald-100">
        <p className="font-semibold text-emerald-700">정보 기준일 · 운영 메모</p>
        <p className="mt-2 text-slate-600">
          가격·예약 방식은 변경될 수 있어요. 최신 정보 제보나 수정 요청은 &quot;등록 제보&quot; 메뉴로 알려주세요.
          운영자 검수 후 반영됩니다.
        </p>
      </div>
    </div>
  )
}

export default CourtDetailPage
