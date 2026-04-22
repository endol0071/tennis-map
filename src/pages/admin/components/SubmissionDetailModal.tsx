import { useState, type ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog'
import { getApiErrorDetails, type ApiFieldErrors } from '../../../lib/api'
import type { AmenityCode, Court, PriceDayType, UpdateCourtBody } from '../../../types/domain'
import type { Submission } from '../types'
import { formatReservationType } from '../../../lib/reservation'
import { useToast } from '../../../components/ui/use-toast'
import {
  amenityOptions,
  courtSpaceOptions,
  priceDayOptions,
  reservationMethodSuggestions,
} from '../../submit/data/options'

type EditableLayout = {
  space: 'indoor' | 'outdoor'
  count: string
  surface: string
  dayType: PriceDayType
  price: string
  note: string
}

type EditForm = {
  name: string
  addressRoad: string
  regionSido: string
  regionSigungu: string
  reservationType: string
  reservationUrl: string
  phone: string
  naverMapUrl: string
  description: string
  amenities: AmenityCode[]
  courtLayouts: EditableLayout[]
}

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

function formatSourceLabel(submission: Submission) {
  return submission.sourceType === 'crawl'
    ? `크롤링${submission.sourceName ? ` · ${submission.sourceName}` : ''}`
    : '사용자 제보'
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

function FieldErrorText({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-rose-600">{message}</p>
}

function toOptionalText(value: string) {
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

function toOptionalNumber(value: string) {
  if (value.trim() === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function toCourtSlug(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\uAC00-\uD7A3\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function resolveCourtId(submission: Submission, matchedCourtId: string | null) {
  if (matchedCourtId) return matchedCourtId
  return toCourtSlug(submission.name) || submission.id.toLowerCase()
}

function buildInitialForm(submission: Submission, court?: Court | null): EditForm {
  const layoutSource = court?.courtLayouts?.length ? court.courtLayouts : submission.courtLayouts
  const fromLayouts: EditableLayout[] =
    layoutSource?.map((layout) => ({
      space: layout.space,
      count: String(layout.count),
      surface: layout.surface || '정보 없음.',
      dayType: layout.dayType ?? 'all',
      price: layout.price ? String(layout.price) : '',
      note: layout.note ?? '요일 구분: 정보 없음. 금액: 정보 없음.',
    })) ?? []

  const fallbackLayouts: EditableLayout[] = []
  const baseIndoorCount = court?.courtsIndoor ?? submission.courtsIndoor
  const baseOutdoorCount = court?.courtsOutdoor ?? submission.courtsOutdoor
  if (!fromLayouts.length && baseIndoorCount && baseIndoorCount > 0) {
    fallbackLayouts.push({
      space: 'indoor',
      count: String(baseIndoorCount),
      surface: court?.courtSurface ?? submission.surface ?? '정보 없음.',
      dayType: 'all',
      price: '',
      note: '요일 구분: 정보 없음. 금액: 정보 없음.',
    })
  }
  if (!fromLayouts.length && baseOutdoorCount && baseOutdoorCount > 0) {
    fallbackLayouts.push({
      space: 'outdoor',
      count: String(baseOutdoorCount),
      surface: court?.courtSurface ?? submission.surface ?? '정보 없음.',
      dayType: 'all',
      price: '',
      note: '요일 구분: 정보 없음. 금액: 정보 없음.',
    })
  }

  if (!fromLayouts.length && !fallbackLayouts.length) {
    fallbackLayouts.push({
      space: 'outdoor',
      count: '1',
      surface: court?.courtSurface ?? submission.surface ?? '정보 없음.',
      dayType: 'all',
      price: '',
      note: '요일 구분: 정보 없음. 금액: 정보 없음.',
    })
  }

  return {
    name: court?.name ?? submission.name ?? '',
    addressRoad: court?.addressRoad ?? submission.addressRoad ?? '',
    regionSido: court?.regionSido ?? submission.regionSido ?? '',
    regionSigungu: court?.regionSigungu ?? submission.regionSigungu ?? '',
    reservationType: court?.reservationType ?? submission.reservationType ?? '',
    reservationUrl: court?.reservationUrl ?? submission.reservationUrl ?? '',
    phone: court?.phone ?? submission.phone ?? '',
    naverMapUrl: court?.naverMapUrl ?? submission.naverMapUrl ?? '',
    description: court?.description ?? submission.note ?? '',
    amenities: court?.amenities?.map((item) => item.code) ?? submission.amenities?.map((item) => item.code) ?? [],
    courtLayouts: fromLayouts.length ? fromLayouts : fallbackLayouts,
  }
}

interface Props {
  submission: Submission | null
  courtId: string | null
  court?: Court | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaveCourt: (id: string, payload: UpdateCourtBody) => Promise<unknown>
  onDeleteCourt: (id: string) => Promise<void>
  onChangeStatus: (id: string, status: Submission['status']) => Promise<Submission>
  updatingStatus?: boolean
  savingCourt?: boolean
  deletingCourt?: boolean
}

export function SubmissionDetailModal({
  submission,
  courtId,
  court,
  open,
  onOpenChange,
  onSaveCourt,
  onDeleteCourt,
  onChangeStatus,
  updatingStatus,
  savingCourt,
  deletingCourt,
}: Props) {
  const [form, setForm] = useState<EditForm | null>(() => (submission ? buildInitialForm(submission, court) : null))
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({})
  const [successMessage, setSuccessMessage] = useState('')
  const [resolvedCourtId, setResolvedCourtId] = useState<string | null>(courtId ?? null)
  const { toast } = useToast()

  if (!submission || !form) {
    return null
  }

  const isSubmitting = Boolean(updatingStatus || savingCourt || deletingCourt)
  const matchedCourtId = resolvedCourtId ?? courtId
  const targetCourtId = matchedCourtId ?? resolveCourtId(submission, courtId)
  const hasMatchedCourt = matchedCourtId !== null
  const canSaveCourt = matchedCourtId !== null
  const approvalHint = hasMatchedCourt
    ? `승인 시 연결된 코트(${matchedCourtId})를 업데이트합니다.`
    : '승인 시 이 제보를 기준으로 새 코트를 생성합니다.'
  const flatFieldErrors = Object.values(fieldErrors).flat()

  const clearMessages = () => {
    setErrorMessage('')
    setSuccessMessage('')
    setFieldErrors({})
  }

  const showValidationError = (message: string, nextFieldErrors: ApiFieldErrors = {}) => {
    setErrorMessage(message)
    setSuccessMessage('')
    setFieldErrors(nextFieldErrors)
  }

  const updateField = <K extends keyof EditForm>(key: K, value: EditForm[K]) => {
    clearMessages()
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const updateLayout = <K extends keyof EditableLayout>(index: number, key: K, value: EditableLayout[K]) => {
    clearMessages()
    setForm((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        courtLayouts: prev.courtLayouts.map((layout, idx) =>
          idx === index ? { ...layout, [key]: value } : layout,
        ),
      }
    })
  }

  const addLayout = () => {
    clearMessages()
    setForm((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        courtLayouts: [
          ...prev.courtLayouts,
          {
            space: 'indoor',
            count: '',
            surface: '정보 없음.',
            dayType: 'all',
            price: '',
            note: '요일 구분: 정보 없음. 금액: 정보 없음.',
          },
        ],
      }
    })
  }

  const removeLayout = (index: number) => {
    clearMessages()
    setForm((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        courtLayouts: prev.courtLayouts.filter((_, idx) => idx !== index),
      }
    })
  }

  const toggleAmenity = (amenity: AmenityCode) => {
    clearMessages()
    setForm((prev) => {
      if (!prev) return prev
      const exists = prev.amenities.includes(amenity)
      const amenities = exists ? prev.amenities.filter((item) => item !== amenity) : [...prev.amenities, amenity]
      return { ...prev, amenities }
    })
  }

  const buildPayload = () => {
    const name = form.name.trim()
    if (!name) {
      showValidationError('코트명을 입력해 주세요.', { name: ['코트명을 입력해 주세요.'] })
      return null
    }

    const addressRoad = form.addressRoad.trim()
    if (!addressRoad) {
      showValidationError('주소를 입력해 주세요.', { addressRoad: ['주소를 입력해 주세요.'] })
      return null
    }

    const regionSido = form.regionSido.trim()
    const regionSigungu = form.regionSigungu.trim()
    if (!regionSido || !regionSigungu) {
      const nextFieldErrors: ApiFieldErrors = {}
      if (!regionSido) {
        nextFieldErrors.regionSido = ['시/도를 입력해 주세요.']
      }
      if (!regionSigungu) {
        nextFieldErrors.regionSigungu = ['시/군/구를 입력해 주세요.']
      }
      showValidationError('지역(시/도, 시/군/구)을 입력해 주세요.', {
        ...nextFieldErrors,
      })
      return null
    }

    if (!form.courtLayouts.length) {
      showValidationError('코트 구성을 최소 1개 등록해 주세요.', {
        courtLayouts: ['코트 구성을 최소 1개 등록해 주세요.'],
      })
      return null
    }

    let indoorTotal = 0
    let outdoorTotal = 0

    const courtLayouts = form.courtLayouts.reduce<NonNullable<UpdateCourtBody['courtLayouts']>>((acc, layout, index) => {
      const count = toOptionalNumber(layout.count)
      if (!count || count <= 0) {
        showValidationError(`${index + 1}번째 코트의 면수는 1 이상 숫자로 입력해 주세요.`, {
          courtLayouts: [`${index + 1}번째 코트의 면수를 확인해 주세요.`],
        })
        return acc
      }

      const surface = layout.surface.trim() || '정보 없음.'

      const hasPriceInput = layout.price.trim() !== ''
      const price = toOptionalNumber(layout.price)
      if (hasPriceInput && (!price || price <= 0)) {
        showValidationError(`${index + 1}번째 코트의 금액은 1원 이상 숫자로 입력해 주세요.`, {
          courtLayouts: [`${index + 1}번째 코트의 금액을 확인해 주세요.`],
        })
        return acc
      }

      if (layout.space === 'indoor') indoorTotal += count
      if (layout.space === 'outdoor') outdoorTotal += count

      const nextLayout: NonNullable<UpdateCourtBody['courtLayouts']>[number] = {
        space: layout.space,
        count,
        surface,
      }

      if (price && price > 0) {
        nextLayout.dayType = layout.dayType
        nextLayout.price = price
      }

      const note = toOptionalText(layout.note)
      if (note) {
        nextLayout.note = note
      }

      acc.push(nextLayout)
      return acc
    }, [])

    if (courtLayouts.length !== form.courtLayouts.length) {
      return null
    }

    const payload: UpdateCourtBody = {
      name,
      addressRoad,
      regionSido,
      regionSigungu,
      courtsIndoor: indoorTotal,
      courtsOutdoor: outdoorTotal,
      reservationType: toOptionalText(form.reservationType),
      reservationUrl: toOptionalText(form.reservationUrl),
      phone: toOptionalText(form.phone),
      naverMapUrl: toOptionalText(form.naverMapUrl),
      description: toOptionalText(form.description),
      courtLayouts,
      amenities: form.amenities.length ? form.amenities : undefined,
    }

    return payload
  }

  const saveCourt = async () => {
    if (!matchedCourtId) {
      showValidationError('이 제보는 아직 연결된 코트가 없어 수정 저장할 수 없습니다. 먼저 승인해 주세요.')
      return
    }

    const payload = buildPayload()
    if (!payload) return

    clearMessages()

    try {
      await onSaveCourt(targetCourtId, payload)
      setResolvedCourtId(targetCourtId)
      setSuccessMessage('코트 정보를 저장했습니다.')
      toast({
        title: '저장 완료',
        description: '코트 정보가 저장되었습니다.',
        variant: 'success',
      })
    } catch (error) {
      const details = getApiErrorDetails(error)
      setErrorMessage(details.message || '코트 정보 저장에 실패했습니다.')
      setFieldErrors(details.fieldErrors)
    }
  }

  const changeStatus = async (status: Submission['status']) => {
    clearMessages()

    try {
      if (status === 'approved') {
        const payload = buildPayload()
        if (!payload) return

        if (matchedCourtId) {
          await onSaveCourt(targetCourtId, payload)
          setResolvedCourtId(targetCourtId)
          toast({
            title: '저장 완료',
            description: '코트 정보가 저장되었습니다.',
            variant: 'success',
          })
        }
        const updatedSubmission = await onChangeStatus(submission.id, status)
        if (updatedSubmission.status === 'approved') {
          setSuccessMessage(
            matchedCourtId
              ? '코트 정보를 저장한 뒤 승인했습니다.'
              : '승인했습니다. 새 코트 연결 정보는 목록 재조회 후 자동으로 반영됩니다.',
          )
        } else {
          setSuccessMessage(`상태가 ${statusLabel[updatedSubmission.status]}로 반영되었습니다.`)
        }
        return
      }

      const updatedSubmission = await onChangeStatus(submission.id, status)
      setSuccessMessage(`상태가 ${statusLabel[updatedSubmission.status]}로 변경되었습니다.`)
    } catch (error) {
      const details = getApiErrorDetails(error)
      setErrorMessage(details.message || '상태 변경에 실패했습니다.')
      setFieldErrors(details.fieldErrors)
    }
  }

  const handleDeleteCourt = async () => {
    if (!matchedCourtId) {
      setErrorMessage('매칭되는 코트 ID를 찾지 못해 삭제할 수 없습니다.')
      return
    }

    const confirmed = window.confirm('코트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')
    if (!confirmed) return

    clearMessages()
    try {
      await onDeleteCourt(matchedCourtId)
    } catch (error) {
      const details = getApiErrorDetails(error)
      setErrorMessage(details.message || '코트 삭제에 실패했습니다.')
      setFieldErrors(details.fieldErrors)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] max-w-3xl space-y-4 overflow-y-auto"
        onInteractOutside={(event) => {
          const target = event.target as HTMLElement | null
          if (target?.closest('[data-toast-root="true"]')) {
            event.preventDefault()
          }
        }}
      >
        <DialogHeader className="space-y-2 text-left">
          <div className="flex flex-wrap items-center gap-2 pr-8">
            <DialogTitle>{submission.name}</DialogTitle>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusColor[submission.status]}`}>
              {statusLabel[submission.status]}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              {formatSourceLabel(submission)}
            </span>
          </div>
          <DialogDescription className="leading-relaxed">
            코트 상세 정보를 먼저 수정 저장하고, 확인 후 승인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            <p className="font-semibold">입력 내용을 다시 확인해 주세요.</p>
            <p className="mt-1">{errorMessage}</p>
            {flatFieldErrors.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-rose-700">
                {flatFieldErrors.map((message, index) => (
                  <li key={`${message}-${index}`}>{message}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        {successMessage && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">기본 정보</p>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="제보 ID" value={submission.id} />
            <Field label="제출일" value={submission.submittedAt} />
            <Field label="제보자" value={submission.submitter} />
            <Field label="유입 경로" value={formatSourceLabel(submission)} />
            {submission.externalId && <Field label="외부 ID" value={submission.externalId} />}
            {submission.sourceUrl && (
              <Field
                label="원본 링크"
                value={
                  <a
                    href={submission.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 underline underline-offset-2"
                  >
                    {submission.sourceUrl}
                  </a>
                }
              />
            )}
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">코트명</p>
              <input
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
              />
              <FieldErrorText message={fieldErrors.name?.[0]} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">주소(도로명)</p>
              <input
                value={form.addressRoad}
                onChange={(e) => updateField('addressRoad', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
              />
              <FieldErrorText message={fieldErrors.addressRoad?.[0]} />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">시/도</p>
              <input
                value={form.regionSido}
                onChange={(e) => updateField('regionSido', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
              />
              <FieldErrorText message={fieldErrors.regionSido?.[0]} />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">시/군/구</p>
              <input
                value={form.regionSigungu}
                onChange={(e) => updateField('regionSigungu', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
              />
              <FieldErrorText message={fieldErrors.regionSigungu?.[0]} />
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">코트 상세</p>
          <FieldErrorText message={fieldErrors.courtLayouts?.[0]} />

          <div className="space-y-2">
            {form.courtLayouts.map((layout, index) => (
              <div key={index} className="space-y-2 rounded-lg bg-white px-3 py-3 ring-1 ring-slate-200">
                <div className="grid gap-2 md:grid-cols-6">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">코트 종류</p>
                    <select
                      value={layout.space}
                      onChange={(e) => updateLayout(index, 'space', e.target.value as EditableLayout['space'])}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
                    >
                      {courtSpaceOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">면수</p>
                    <input
                      value={layout.count}
                      onChange={(e) => updateLayout(index, 'count', e.target.value)}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">바닥재</p>
                    <input
                      value={layout.surface}
                      onChange={(e) => updateLayout(index, 'surface', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">요일 구분</p>
                    <select
                      value={layout.dayType}
                      onChange={(e) => updateLayout(index, 'dayType', e.target.value as PriceDayType)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
                    >
                      {priceDayOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">금액</p>
                    <input
                      value={layout.price}
                      onChange={(e) => updateLayout(index, 'price', e.target.value)}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeLayout(index)}
                      className="w-full rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700"
                    >
                      항목 삭제
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">비고</p>
                  <input
                    value={layout.note}
                    onChange={(e) => updateLayout(index, 'note', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addLayout}
            className="rounded-full border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-700"
          >
            코트 항목 추가
          </button>
        </section>

        <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">예약/연락/편의시설</p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">예약 방법</p>
              <input
                value={form.reservationType}
                onChange={(e) => updateField('reservationType', e.target.value)}
                list="admin-reservation-type-suggestions"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
                placeholder={formatReservationType(submission.reservationType)}
              />
              <datalist id="admin-reservation-type-suggestions">
                {reservationMethodSuggestions.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">예약 링크</p>
              <input
                value={form.reservationUrl}
                onChange={(e) => updateField('reservationUrl', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">전화번호</p>
              <input
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">네이버 지도 링크</p>
              <input
                value={form.naverMapUrl}
                onChange={(e) => updateField('naverMapUrl', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">편의시설</p>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((amenity) => {
                const active = form.amenities.includes(amenity.code)
                return (
                  <button
                    key={amenity.code}
                    type="button"
                    onClick={() => toggleAmenity(amenity.code)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${
                      active
                        ? 'bg-emerald-500 text-white ring-emerald-300'
                        : 'bg-slate-100 text-slate-700 ring-slate-200'
                    }`}
                  >
                    {amenity.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">코트 설명</p>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none"
            />
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs text-slate-500">{approvalHint}</p>
          <button
            type="button"
            onClick={handleDeleteCourt}
            disabled={isSubmitting || !canSaveCourt}
            className={`rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 ${
              isSubmitting || !canSaveCourt ? 'cursor-not-allowed opacity-60' : ''
            }`}
          >
            {deletingCourt ? '삭제 중...' : '코트 삭제'}
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={saveCourt}
              disabled={isSubmitting || !canSaveCourt}
              className={`rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-white ${
                isSubmitting || !canSaveCourt ? 'cursor-not-allowed opacity-60' : ''
              }`}
            >
              {savingCourt ? '저장 중...' : '수정 저장'}
            </button>
            <button
              type="button"
              disabled={isSubmitting || submission.status === 'approved'}
              onClick={() => changeStatus('approved')}
              className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
                submission.status === 'approved'
                  ? 'bg-emerald-500 text-white ring-emerald-300'
                  : 'bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200'
              } ${isSubmitting ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              {updatingStatus ? '처리 중...' : hasMatchedCourt ? '업데이트 후 승인' : '생성 후 승인'}
            </button>
            <button
              type="button"
              disabled={isSubmitting || submission.status === 'pending'}
              onClick={() => changeStatus('pending')}
              className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
                submission.status === 'pending'
                  ? 'bg-amber-100 text-amber-900 ring-amber-200'
                  : 'bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200'
              } ${isSubmitting ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              {updatingStatus ? '처리 중...' : '대기'}
            </button>
            <button
              type="button"
              disabled={isSubmitting || submission.status === 'rejected'}
              onClick={() => changeStatus('rejected')}
              className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
                submission.status === 'rejected'
                  ? 'bg-rose-100 text-rose-800 ring-rose-200'
                  : 'bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200'
              } ${isSubmitting ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              {updatingStatus ? '처리 중...' : '반려'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
