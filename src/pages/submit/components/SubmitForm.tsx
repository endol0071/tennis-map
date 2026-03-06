import {
  amenityOptions,
  courtSpaceOptions,
  courtSurfaceOptions,
  priceDayOptions,
  reservationMethodSuggestions,
} from '../data/options'
import type { DraftCourtLayout, FormState } from '../hooks/useSubmitForm'
import type { AmenityCode } from '../../../types/domain'

interface Props {
  form: FormState
  isDraftCourtLayoutOpen: boolean
  draftCourtLayout: DraftCourtLayout
  courtLayoutError?: string
  submitted: boolean
  submitting: boolean
  errorMessage?: string
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void
  onToggleAmenity: (amenity: AmenityCode) => void
  onOpenDraftCourtLayout: () => void
  onCancelDraftCourtLayout: () => void
  onChangeDraftCourtLayout: <K extends keyof DraftCourtLayout>(key: K, value: DraftCourtLayout[K]) => void
  onConfirmCourtLayout: () => void
  onRemoveCourtLayout: (index: number) => void
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

export function SubmitForm({
  form,
  isDraftCourtLayoutOpen,
  draftCourtLayout,
  courtLayoutError,
  submitted,
  submitting,
  errorMessage,
  onChange,
  onToggleAmenity,
  onOpenDraftCourtLayout,
  onCancelDraftCourtLayout,
  onChangeDraftCourtLayout,
  onConfirmCourtLayout,
  onRemoveCourtLayout,
  onReset,
  onSubmit,
}: Props) {
  const spaceLabel: Record<DraftCourtLayout['space'], string> = {
    indoor: '실내',
    outdoor: '야외',
  }
  const dayTypeLabel: Record<DraftCourtLayout['dayType'], string> = {
    all: '전체',
    weekday: '평일',
    weekend: '주말',
    holiday: '공휴일',
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {submitted && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          제보가 접수되었습니다. 관리 대시보드의 대기 목록으로 추가되었습니다.
        </div>
      )}
      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          제출 중 오류가 발생했습니다: {errorMessage}
        </div>
      )}

      <Section title="기본 정보">
        <div className="grid gap-3 md:grid-cols-3">
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
            <label className="text-xs uppercase tracking-[0.15em] text-slate-500">네이버 지도 링크*</label>
            <input
              value={form.naverMapUrl}
              onChange={(e) => onChange('naverMapUrl', e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
              placeholder="https://map.naver.com/..."
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-slate-500">전화번호*</label>
            <input
              value={form.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
              placeholder="02-000-0000"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-slate-500">소재지</label>
            <input
              value={form.location}
              onChange={(e) => onChange('location', e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
              placeholder="예) 서울 송파구, 천안시"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-slate-500">제보자 이름/닉네임</label>
            <input
              value={form.submitter}
              onChange={(e) => onChange('submitter', e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
              placeholder="선택 입력"
            />
          </div>
        </div>
      </Section>

      <Section title="예약 · 메모">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-slate-500">예약 방법</label>
            <input
              value={form.reservationMethod}
              onChange={(e) => onChange('reservationMethod', e.target.value)}
              list="reservation-method-suggestions"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
              placeholder="예) 공공예약, 전화예약, 앱/플랫폼"
            />
            <datalist id="reservation-method-suggestions">
              {reservationMethodSuggestions.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
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
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-slate-500">추가 메모</label>
          <input
            value={form.note}
            onChange={(e) => onChange('note', e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-200"
            placeholder="운영시간, 참고사항 등"
          />
        </div>
      </Section>

      <Section title="편의시설">
        <div className="flex flex-wrap gap-2">
          {amenityOptions.map((amenity) => {
            const active = form.amenities.includes(amenity.code)
            return (
              <button
                type="button"
                key={amenity.code}
                onClick={() => onToggleAmenity(amenity.code)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ring-1 ${
                  active ? 'bg-emerald-500 text-white ring-emerald-300' : 'bg-slate-100 text-slate-700 ring-slate-200'
                }`}
              >
                {amenity.name}
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="코트 정보">
        <p className="text-xs text-slate-500">
          코트 정보를 입력한 뒤 확인 버튼을 눌러 카드로 추가해 주세요. 제출 시에는 아래 카드로 확정된 정보만 전송됩니다.
        </p>
        <div className="space-y-3">
          {form.courtLayouts.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              확정된 코트 정보가 아직 없습니다.
            </p>
          )}

          {form.courtLayouts.map((layout, index) => (
            <div key={index} className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="space-y-1 text-sm text-slate-700">
                <p className="font-medium text-slate-900">
                  {spaceLabel[layout.space]} · {layout.count}면 · {layout.surface}
                </p>
                {layout.price ? (
                  <p>
                    {dayTypeLabel[layout.dayType ?? 'all']} · {layout.price.toLocaleString()}원
                  </p>
                ) : (
                  <p className="text-slate-500">가격 정보 없음</p>
                )}
                {layout.note && <p className="text-xs text-slate-600">{layout.note}</p>}
              </div>
              <button
                type="button"
                onClick={() => onRemoveCourtLayout(index)}
                className="shrink-0 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700"
              >
                삭제
              </button>
            </div>
          ))}

          {!isDraftCourtLayoutOpen && (
            <button
              type="button"
              onClick={onOpenDraftCourtLayout}
              className="rounded-full border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-700"
            >
              추가하기
            </button>
          )}

          {isDraftCourtLayoutOpen && (
            <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-white p-3">
              <div className="grid gap-3 md:grid-cols-5">
                <div>
                  <label className="text-xs uppercase tracking-[0.12em] text-slate-500">코트 종류</label>
                  <select
                    value={draftCourtLayout.space}
                    onChange={(e) => onChangeDraftCourtLayout('space', e.target.value as DraftCourtLayout['space'])}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
                  >
                    {courtSpaceOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.12em] text-slate-500">면수</label>
                  <input
                    value={draftCourtLayout.count}
                    onChange={(e) => onChangeDraftCourtLayout('count', e.target.value)}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="숫자"
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.12em] text-slate-500">바닥재</label>
                  <select
                    value={draftCourtLayout.surface}
                    onChange={(e) => onChangeDraftCourtLayout('surface', e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
                  >
                    <option value="">선택</option>
                    {courtSurfaceOptions.map((surface) => (
                      <option key={surface} value={surface}>
                        {surface}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.12em] text-slate-500">요일 구분</label>
                  <select
                    value={draftCourtLayout.dayType}
                    onChange={(e) => onChangeDraftCourtLayout('dayType', e.target.value as DraftCourtLayout['dayType'])}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
                  >
                    {priceDayOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.12em] text-slate-500">금액</label>
                  <input
                    value={draftCourtLayout.price}
                    onChange={(e) => onChangeDraftCourtLayout('price', e.target.value)}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="숫자(원)"
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.12em] text-slate-500">비고</label>
                <input
                  value={draftCourtLayout.note}
                  onChange={(e) => onChangeDraftCourtLayout('note', e.target.value)}
                  placeholder="예) 야간 요금"
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
                />
              </div>

              {courtLayoutError && (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  {courtLayoutError}
                </p>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onCancelDraftCourtLayout}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={onConfirmCourtLayout}
                  className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  확인
                </button>
              </div>
            </div>
          )}
        </div>
      </Section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? '제출 중...' : '제보 제출'}
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
