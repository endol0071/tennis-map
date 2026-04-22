export type AmenityCode =
  | 'parking'
  | 'shower'
  | 'lighting'
  | 'locker'
  | 'rental'
  | 'cafeteria'

export type CourtSpaceType = 'indoor' | 'outdoor'
export type PriceDayType = 'weekday' | 'weekend' | 'holiday' | 'all'

export interface Amenity {
  code: AmenityCode
  name: string
}

export interface CourtLayout {
  space: CourtSpaceType
  count: number
  surface: string
  dayType?: PriceDayType
  price?: number
  note?: string
}

export type IndoorFilter = 'all' | 'indoor' | 'outdoor'
export type SortOption = 'popular' | 'priceAsc' | 'priceDesc' | 'courts'

export interface CourtFilterQuery {
  page?: number | string
  limit?: number | string
  search?: string
  regionSido?: string
  regionSigungu?: string
  indoor?: IndoorFilter
  amenity?: AmenityCode | 'all'
  sort?: SortOption
}

export interface CourtResponse {
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
  reservationType: string
  reservationUrl?: string
  phone?: string
  naverMapUrl?: string
  description?: string
  courtLayouts?: CourtLayout[]
  amenities: Amenity[]
  images: string[]
  popularity?: number
}

export interface SubmissionFilterQuery {
  page?: number | string
  limit?: number | string
  status?: 'pending' | 'approved' | 'rejected'
}

export interface CreateSubmissionBody {
  name: string
  naverMapUrl: string
  phone: string
  location?: string
  images?: string[]
  submitter?: string
  reservationMethod?: string
  reservationType?: string
  note?: string
  reservationUrl?: string
  priceNote?: string
  courtLayouts?: CourtLayout[]
  amenities?: Amenity[] | AmenityCode[]
  courtsIndoor?: number
  courtsOutdoor?: number
  surface?: string
  region?: { kind: 'seoul' | 'local'; district?: string; cityOrCounty?: string }
  addressRoad?: string
  regionSido?: string
  regionSigungu?: string
}

export interface SubmissionResponse {
  id: string
  name: string
  linkedCourtId?: string
  sourceType?: 'user' | 'crawl'
  sourceName?: string
  sourceUrl?: string
  externalId?: string
  addressRoad: string
  regionSido: string
  regionSigungu: string
  submitter: string
  status: 'pending' | 'approved' | 'rejected'
  reservationType: string
  submittedAt: string
  note?: string
  reservationUrl?: string
  phone?: string
  priceNote?: string
  courtsIndoor?: number
  courtsOutdoor?: number
  surface?: string
  courtLayouts?: CourtLayout[]
  amenities?: Amenity[]
  naverMapUrl?: string
  images?: string[]
  rawPayload?: unknown
}

export interface UpdateCourtBody {
  name?: string
  addressRoad?: string
  regionSido?: string
  regionSigungu?: string
  lat?: number
  lng?: number
  courtsIndoor?: number
  courtsOutdoor?: number
  courtSurface?: string
  reservationType?: string
  reservationUrl?: string
  phone?: string
  naverMapUrl?: string
  description?: string
  priceType?: 'hourly' | 'rental' | 'membership'
  priceNote?: string
  amenities?: Amenity[] | AmenityCode[]
  courtLayouts?: CourtLayout[]
  images?: string[]
  popularity?: number
}

export interface UpdateSubmissionStatusBody {
  status: 'pending' | 'approved' | 'rejected'
}

export type Court = CourtResponse
export type Submission = SubmissionResponse
export type SubmissionPayload = CreateSubmissionBody
