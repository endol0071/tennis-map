import type { Amenity, ReservationType } from '../../../types/domain'

export const amenityOptions: Amenity[] = ['parking', 'shower', 'lighting', 'locker', 'rental', 'cafeteria']

export const reservationOptions: { key: ReservationType; label: string }[] = [
  { key: 'public', label: '공공예약' },
  { key: 'phone', label: '전화' },
  { key: 'app', label: '앱/플랫폼' },
  { key: 'onsite', label: '현장' },
  { key: 'lottery', label: '추첨' },
]

export const surfaceOptions = ['하드', '클레이', '인조잔디', '카펫']
