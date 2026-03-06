import type { Amenity, CourtLayout, PriceDayType } from '../../../types/domain'

export const amenityOptions: Amenity[] = [
  { code: 'parking', name: '주차' },
  { code: 'shower', name: '샤워' },
  { code: 'lighting', name: '조명' },
  { code: 'locker', name: '락커' },
  { code: 'rental', name: '장비 대여' },
  { code: 'cafeteria', name: '카페테리아' },
]

export const reservationMethodSuggestions = ['공공예약', '전화예약', '앱/플랫폼', '현장', '추첨']

export const courtSpaceOptions: { key: CourtLayout['space']; label: string }[] = [
  { key: 'indoor', label: '실내' },
  { key: 'outdoor', label: '야외' },
]

export const courtSurfaceOptions = ['하드', '클레이', '잔디', '카페트'] as const

export const priceDayOptions: { key: PriceDayType; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'weekday', label: '평일' },
  { key: 'weekend', label: '주말' },
  { key: 'holiday', label: '공휴일' },
]
