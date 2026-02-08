export type ReservationType = 'public' | 'phone' | 'app' | 'onsite' | 'lottery'

export type Amenity = 'parking' | 'shower' | 'lighting' | 'locker' | 'rental' | 'cafeteria'

export interface Court {
  id: string
  name: string
  addressRoad: string
  regionSido: string
  regionSigungu: string
  lat?: number
  lng?: number
  courtsIndoor: number
  courtsOutdoor: number
  courtsTotal?: number
  courtSurface?: string
  isIndoorAvailable: boolean
  isOutdoorAvailable: boolean
  priceType?: 'hourly' | 'rental' | 'membership'
  priceMin?: number
  priceMax?: number
  priceNote?: string
  priceUpdatedAt?: string
  reservationType: ReservationType
  reservationUrl?: string
  phone?: string
  naverMapUrl?: string
  description?: string
  amenities: Amenity[]
  images: string[]
  popularity?: number
}

export interface Submission {
  id: string
  name: string
  addressRoad: string
  regionSido: string
  regionSigungu: string
  submitter: string
  status: 'pending' | 'approved' | 'rejected'
  reservationType: ReservationType
  submittedAt: string
  note?: string
}
