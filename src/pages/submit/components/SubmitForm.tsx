import { amenityOptions, reservationOptions, surfaceOptions } from '../data/options'
import type { FormState } from '../hooks/useSubmitForm'

interface Props {
  form: FormState
  submitted: boolean
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void
  onToggleAmenity: (amenity: FormState['amenities'][number]) => void
  onReset: () => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 ring-1 ring-emerald-50 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">{title}</p>
      {children}
    </div>
  )
}

export function SubmitForm({ form, submitted, onChange, onToggleAmenity, onReset, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {submitted && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          제보가 제출된 것으로 가정합니다. 실제 연동 시 API 호출 및 검수 대기 상태로 전환하면 됩니다.
        </div>
      )}

      <Section title="기본 정보">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-slate-500">테니스장명*</label>
            <input
              value={form.name}
              onChange={(e) => onChange('name', e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
              placeholder="예) 한강 리버사이드 테니스장"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-slate-500">네이버 지도 링크</label>
            <input
              value={form.naverMapUrl}
              onChange={(e) => onChange('naverMapUrl', e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
              placeholder="https://map.naver.com/..."
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-slate-500">주소(도로명)*</label>
          <input
            value={form.addressRoad}
            onChange={(e) => onChange('addressRoad', e.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
            placeholder="도로명 주소를 입력하세요"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-slate-500">시/도*</label>
            <input
              value={form.regionSido}
              onChange={(e) => onChange('regionSido', e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
              placeholder="서울특별시"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-slate-500">시/군/구*</label>
            <input
              value={form.regionSigungu}
              onChange={(e) => onChange('regionSigungu', e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
              placeholder="영등포구"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-slate-500">전화번호</label>
            <input
              value={form.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
              placeholder="02-000-0000 또는 없음"
            />
          </div>
        </div>
      </Section>

      <Section title="코트 정보">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-slate-500">실내 코트 수</label>
            <input
              type="number"
              min={0}
              value={form.courtsIndoor}
              onChange={(e) => onChange('courtsIndoor', Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-slate-500">야외 코트 수</label>
            <input
              type="number"
              min={0}
              value={form.courtsOutdoor}
              onChange={(e) => onChange('courtsOutdoor', Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-slate-500">코트 바닥재</label>
            <select
              value={form.surface}
              onChange={(e) => onChange('surface', e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
            >
              <option value="">선택</option>
              {surfaceOptions.map((surface) => (
                <option key={surface} value={surface}>
                  {surface}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {amenityOptions.map((amenity) => {
            const active = form.amenities.includes(amenity)
            return (
              <button
                type="button"
                key={amenity}
                onClick={() => onToggleAmenity(amenity)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ring-1 ${
                  active ? 'bg-emerald-500 text-white ring-emerald-300' : 'bg-slate-100 text-slate-700 ring-slate-200'
                }`}
              >
                {amenity}
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="가격 · 예약">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-slate-500">가격/비고</label>
            <input
              value={form.priceNote}
              onChange={(e) => onChange('priceNote', e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
              placeholder="예) 평일 1시간 12,000원, 주말 15,000원"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-slate-500">예약 방법</label>
            <select
              value={form.reservationType}
              onChange={(e) => onChange('reservationType', e.target.value as FormState['reservationType'])}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
            >
              {reservationOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-slate-500">예약 링크</label>
          <input
            value={form.reservationUrl}
            onChange={(e) => onChange('reservationUrl', e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
            placeholder="https://..."
          />
        </div>
      </Section>

      <Section title="제보자 정보">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-slate-500">제보자 이름/닉네임</label>
            <input
              value={form.submitter}
              onChange={(e) => onChange('submitter', e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
              placeholder="선택 입력"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-slate-500">추가 메모</label>
            <input
              value={form.note}
              onChange={(e) => onChange('note', e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
              placeholder="운영시간, 주차비 등"
            />
          </div>
        </div>
      </Section>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:brightness-110"
        >
          제보 제출 (UI만)
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-emerald-300"
        >
          초기화
        </button>
      </div>
    </form>
  )
}
