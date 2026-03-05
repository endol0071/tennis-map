import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createSubmission } from '../../../lib/api'
import type { Amenity, SubmissionPayload } from '../../../types/domain'

type FormOverrides =
  | 'courtsIndoor'
  | 'courtsOutdoor'
  | 'surface'
  | 'phone'
  | 'reservationUrl'
  | 'amenities'
  | 'naverMapUrl'
  | 'submitter'
  | 'note'
  | 'priceNote'

export type FormState = Omit<SubmissionPayload, FormOverrides> & {
  courtsIndoor: string
  courtsOutdoor: string
  surface: string
  phone: string
  priceNote: string
  note: string
  reservationUrl: string
  amenities: Amenity[]
  naverMapUrl: string
  submitter: string
}

const initialState: FormState = {
  name: '',
  addressRoad: '',
  regionSido: '',
  regionSigungu: '',
  courtsIndoor: '',
  courtsOutdoor: '',
  surface: '',
  phone: '',
  reservationType: 'public',
  reservationUrl: '',
  priceNote: '',
  amenities: [],
  naverMapUrl: '',
  submitter: '',
  note: '',
}

export function useSubmitForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [submitted, setSubmitted] = useState(false)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      setSubmitted(true)
      setForm(initialState)
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
    },
  })

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setSubmitted(false)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleAmenity = (amenity: Amenity) => {
    setForm((prev) => {
      const exists = prev.amenities.includes(amenity)
      const amenities = exists ? prev.amenities.filter((a) => a !== amenity) : [...prev.amenities, amenity]
      return { ...prev, amenities }
    })
  }

  const reset = () => {
    setForm(initialState)
    setSubmitted(false)
    mutation.reset()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload: SubmissionPayload = {
      ...form,
      courtsIndoor: form.courtsIndoor === '' ? undefined : Number(form.courtsIndoor),
      courtsOutdoor: form.courtsOutdoor === '' ? undefined : Number(form.courtsOutdoor),
    }
    mutation.mutate(payload)
  }

  return {
    form,
    submitted,
    submitting: mutation.isPending,
    error: mutation.error,
    update,
    toggleAmenity,
    reset,
    handleSubmit,
  }
}
