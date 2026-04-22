import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createSubmission, getApiErrorDetails } from '../../../lib/api'
import type { AmenityCode, CourtLayout, CreateSubmissionBody } from '../../../types/domain'

export interface DraftCourtLayout {
  space: CourtLayout['space']
  count: string
  surface: string
  dayType: NonNullable<CourtLayout['dayType']>
  price: string
  note: string
}

export interface FormState {
  name: string
  naverMapUrl: string
  phone: string
  location: string
  submitter: string
  reservationMethod: string
  note: string
  reservationUrl: string
  amenities: AmenityCode[]
  courtLayouts: CourtLayout[]
}

const initialState: FormState = {
  name: '',
  naverMapUrl: '',
  phone: '',
  location: '',
  submitter: '',
  reservationMethod: '',
  note: '',
  reservationUrl: '',
  amenities: [],
  courtLayouts: [],
}

const initialDraftCourtLayout: DraftCourtLayout = {
  space: 'indoor',
  count: '',
  surface: '',
  dayType: 'all',
  price: '',
  note: '',
}

function toOptionalNumber(value: string) {
  if (value.trim() === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function toOptionalText(value: string) {
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

interface UseSubmitFormOptions {
  onSuccess?: () => void
}

export function useSubmitForm(options: UseSubmitFormOptions = {}) {
  const [form, setForm] = useState<FormState>(initialState)
  const [isDraftCourtLayoutOpen, setIsDraftCourtLayoutOpen] = useState(false)
  const [draftCourtLayout, setDraftCourtLayout] = useState<DraftCourtLayout>(initialDraftCourtLayout)
  const [courtLayoutError, setCourtLayoutError] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      setSubmitted(true)
      setForm(initialState)
      setIsDraftCourtLayoutOpen(false)
      setDraftCourtLayout(initialDraftCourtLayout)
      setCourtLayoutError('')
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
      options.onSuccess?.()
    },
  })

  const clearSubmissionError = () => {
    if (mutation.error) {
      mutation.reset()
    }
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    clearSubmissionError()
    setSubmitted(false)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleAmenity = (amenity: AmenityCode) => {
    clearSubmissionError()
    setForm((prev) => {
      const exists = prev.amenities.includes(amenity)
      const amenities = exists ? prev.amenities.filter((a) => a !== amenity) : [...prev.amenities, amenity]
      return { ...prev, amenities }
    })
  }

  const updateDraftCourtLayout = <K extends keyof DraftCourtLayout>(key: K, value: DraftCourtLayout[K]) => {
    clearSubmissionError()
    setSubmitted(false)
    setCourtLayoutError('')
    setDraftCourtLayout((prev) => ({ ...prev, [key]: value }))
  }

  const openDraftCourtLayout = () => {
    clearSubmissionError()
    setSubmitted(false)
    setCourtLayoutError('')
    setIsDraftCourtLayoutOpen(true)
  }

  const cancelDraftCourtLayout = () => {
    clearSubmissionError()
    setCourtLayoutError('')
    setDraftCourtLayout(initialDraftCourtLayout)
    setIsDraftCourtLayoutOpen(false)
  }

  const confirmCourtLayout = () => {
    const count = toOptionalNumber(draftCourtLayout.count)
    if (!count || count <= 0) {
      setCourtLayoutError('면수는 1 이상 숫자로 입력해 주세요.')
      return
    }

    const surface = draftCourtLayout.surface.trim()
    if (!surface) {
      setCourtLayoutError('바닥재를 선택해 주세요.')
      return
    }

    const hasPriceInput = draftCourtLayout.price.trim() !== ''
    const price = toOptionalNumber(draftCourtLayout.price)
    if (hasPriceInput && (!price || price <= 0)) {
      setCourtLayoutError('금액은 1원 이상 숫자로 입력해 주세요.')
      return
    }

    const nextCourtLayout: CourtLayout = {
      space: draftCourtLayout.space,
      count,
      surface,
    }

    if (price && price > 0) {
      nextCourtLayout.dayType = draftCourtLayout.dayType
      nextCourtLayout.price = price
    }

    const note = toOptionalText(draftCourtLayout.note)
    if (note) {
      nextCourtLayout.note = note
    }

    clearSubmissionError()
    setSubmitted(false)
    setCourtLayoutError('')
    setForm((prev) => ({
      ...prev,
      courtLayouts: [...prev.courtLayouts, nextCourtLayout],
    }))
    setDraftCourtLayout(initialDraftCourtLayout)
    setIsDraftCourtLayoutOpen(false)
  }

  const removeCourtLayout = (index: number) => {
    clearSubmissionError()
    setSubmitted(false)
    setForm((prev) => ({
      ...prev,
      courtLayouts: prev.courtLayouts.filter((_, idx) => idx !== index),
    }))
  }

  const reset = () => {
    setForm(initialState)
    setIsDraftCourtLayoutOpen(false)
    setDraftCourtLayout(initialDraftCourtLayout)
    setCourtLayoutError('')
    setSubmitted(false)
    mutation.reset()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearSubmissionError()
    setCourtLayoutError('')

    const payload: CreateSubmissionBody = {
      name: form.name.trim(),
      naverMapUrl: form.naverMapUrl.trim(),
      phone: form.phone.trim(),
      location: toOptionalText(form.location),
      submitter: toOptionalText(form.submitter),
      reservationMethod: toOptionalText(form.reservationMethod),
      note: toOptionalText(form.note),
      reservationUrl: toOptionalText(form.reservationUrl),
      courtLayouts: form.courtLayouts.length ? form.courtLayouts : undefined,
      amenities: form.amenities.length ? form.amenities : undefined,
    }
    mutation.mutate(payload)
  }

  return {
    form,
    submitted,
    submitting: mutation.isPending,
    errorMessage: getApiErrorDetails(mutation.error).message,
    fieldErrors: getApiErrorDetails(mutation.error).fieldErrors,
    update,
    toggleAmenity,
    isDraftCourtLayoutOpen,
    draftCourtLayout,
    courtLayoutError,
    openDraftCourtLayout,
    cancelDraftCourtLayout,
    updateDraftCourtLayout,
    confirmCourtLayout,
    removeCourtLayout,
    reset,
    handleSubmit,
  }
}
