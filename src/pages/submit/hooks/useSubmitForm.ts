import { useState } from 'react'
import type { Amenity, ReservationType } from '../types'

export interface FormState {
  name: string
  addressRoad: string
  regionSido: string
  regionSigungu: string
  indoor: boolean
  outdoor: boolean
  courtsIndoor: number
  courtsOutdoor: number
  surface: string
  phone: string
  reservationType: ReservationType
  reservationUrl: string
  priceNote: string
  amenities: Amenity[]
  naverMapUrl: string
  submitter: string
  note: string
}

const initialState: FormState = {
  name: '',
  addressRoad: '',
  regionSido: '',
  regionSigungu: '',
  indoor: true,
  outdoor: true,
  courtsIndoor: 1,
  courtsOutdoor: 1,
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

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
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
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return { form, submitted, update, toggleAmenity, reset, handleSubmit }
}
