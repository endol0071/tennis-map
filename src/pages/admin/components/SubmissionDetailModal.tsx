import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog'
import type { Submission } from '../types'

const statusColor: Record<Submission['status'], string> = {
  pending: 'bg-amber-100 text-amber-900 ring-amber-200',
  approved: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  rejected: 'bg-rose-100 text-rose-800 ring-rose-200',
}

const statusLabel: Record<Submission['status'], string> = {
  pending: '대기',
  approved: '승인',
  rejected: '반려',
}

const reservationLabel: Record<Submission['reservationType'], string> = {
  public: '공공예약',
  phone: '전화',
  app: '앱/플랫폼',
  onsite: '현장',
  lottery: '추첨',
}

const amenityLabel: Record<NonNullable<Submission['amenities']>[number], string> = {
  parking: '주차',
  shower: '샤워',
  lighting: '조명',
  locker: '락커',
  rental: '대여',
  cafeteria: '카페',
}

interface FieldProps {
  label: string
  value: ReactNode
}

function Field({ label, value }: FieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">{label}</p>
      <div className="text-sm text-slate-800">{value}</div>
    </div>
  )
}

const asText = (value?: string | number | null) => {
  if (value === undefined || value === null || value === '') {
    return '없음'
  }
  return String(value)
}

interface Props {
  submission: Submission | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onChangeStatus: (id: string, status: Submission['status']) => void
  updating?: boolean
}

export function SubmissionDetailModal({ submission, open, onOpenChange, onChangeStatus, updating }: Props) {
  if (!submission) {
    return null
  }

  const amenities =
    submission.amenities && submission.amenities.length > 0
      ? submission.amenities.map((item) => amenityLabel[item]).join(', ')
      : '없음'

  const handleStatusChange = (status: Submission['status']) => {
    onChangeStatus(submission.id, status)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl space-y-4 overflow-y-auto">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex flex-wrap items-center gap-2 pr-8">
            <DialogTitle>{submission.name}</DialogTitle>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusColor[submission.status]}`}>
              {statusLabel[submission.status]}
            </span>
          </div>
          <DialogDescription className="leading-relaxed">
            제보 상세를 확인한 뒤 상태를 변경하세요. 모든 필드는 제보자가 입력한 원본 기준입니다.
          </DialogDescription>
        </DialogHeader>

        <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">기본 정보</p>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="제보 ID" value={submission.id} />
            <Field label="제출일" value={submission.submittedAt} />
            <Field label="제보자" value={asText(submission.submitter)} />
            <Field label="주소(도로명)" value={submission.addressRoad} />
            <Field label="지역" value={`${submission.regionSido} ${submission.regionSigungu}`} />
            <Field label="네이버 지도 링크" value={
              submission.naverMapUrl ? (
                <a
                  href={submission.naverMapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-emerald-700 underline underline-offset-2"
                >
                  {submission.naverMapUrl}
                </a>
              ) : (
                '없음'
              )
            } />
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">코트 및 예약 정보</p>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="실내 코트 수" value={asText(submission.courtsIndoor)} />
            <Field label="야외 코트 수" value={asText(submission.courtsOutdoor)} />
            <Field label="바닥재" value={asText(submission.surface)} />
            <Field label="편의시설" value={amenities} />
            <Field label="예약 방법" value={reservationLabel[submission.reservationType]} />
            <Field
              label="예약 링크"
              value={
                submission.reservationUrl ? (
                  <a
                    href={submission.reservationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-emerald-700 underline underline-offset-2"
                  >
                    {submission.reservationUrl}
                  </a>
                ) : (
                  '없음'
                )
              }
            />
            <Field label="전화번호" value={asText(submission.phone)} />
            <Field label="가격/비고" value={asText(submission.priceNote)} />
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">추가 메모</p>
          <p className="rounded-xl bg-white px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200">
            {asText(submission.note)}
          </p>
        </section>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            disabled={updating || submission.status === 'approved'}
            onClick={() => handleStatusChange('approved')}
            className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
              submission.status === 'approved'
                ? 'bg-emerald-500 text-white ring-emerald-300'
                : 'bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200'
            } ${updating ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            승인
          </button>
          <button
            type="button"
            disabled={updating || submission.status === 'pending'}
            onClick={() => handleStatusChange('pending')}
            className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
              submission.status === 'pending'
                ? 'bg-amber-100 text-amber-900 ring-amber-200'
                : 'bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200'
            } ${updating ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            대기
          </button>
          <button
            type="button"
            disabled={updating || submission.status === 'rejected'}
            onClick={() => handleStatusChange('rejected')}
            className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
              submission.status === 'rejected'
                ? 'bg-rose-100 text-rose-800 ring-rose-200'
                : 'bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200'
            } ${updating ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            반려
          </button>
          {updating && <span className="text-xs text-slate-500">저장 중...</span>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
