const reservationTypeLabelMap: Record<string, string> = {
  public: '공공예약',
  phone: '전화예약',
  app: '앱/플랫폼',
  onsite: '현장',
  lottery: '추첨',
  '공공예약': '공공예약',
  '전화': '전화예약',
  '전화예약': '전화예약',
  '앱': '앱/플랫폼',
  '앱/플랫폼': '앱/플랫폼',
  '현장': '현장',
  '추첨': '추첨',
}

export function formatReservationType(value?: string | null) {
  const normalized = value?.trim()
  if (!normalized) return '예약 방식 미입력'

  const mapped = reservationTypeLabelMap[normalized]
  if (mapped) return mapped

  const lower = normalized.toLowerCase()
  return reservationTypeLabelMap[lower] ?? normalized
}
