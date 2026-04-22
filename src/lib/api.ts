import type {
  CourtFilterQuery,
  CourtResponse,
  CreateSubmissionBody,
  SubmissionFilterQuery,
  SubmissionResponse,
  UpdateCourtBody,
  UpdateSubmissionStatusBody,
} from '../types/domain'

const PRODUCTION_API_BASE_URL = 'https://tennis-map-server-production.up.railway.app'
const DEFAULT_API_BASE_URL = import.meta.env.PROD
  ? PRODUCTION_API_BASE_URL
  : 'http://localhost:3000'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, '')

export type ApiFieldErrors = Partial<Record<string, string[]>>

type ApiErrorPayload = {
  message?: unknown
  error?: unknown
  fieldErrors?: unknown
}

const FIELD_LABELS: Record<string, string> = {
  name: '테니스장명',
  naverMapUrl: '네이버 지도 링크',
  phone: '전화번호',
  location: '위치 설명',
  submitter: '제보자',
  reservationMethod: '예약 방법',
  reservationType: '예약 방식',
  reservationUrl: '예약 링크',
  note: '메모',
  description: '코트 설명',
  addressRoad: '주소',
  regionSido: '시/도',
  regionSigungu: '시/군/구',
  amenities: '편의시설',
  courtLayouts: '코트 정보',
}

const RAW_MESSAGE_TO_KOREAN: Record<string, string> = {
  'name is required': '테니스장명을 입력해 주세요.',
  'naverMapUrl is required': '네이버 지도 링크를 입력해 주세요.',
  'phone is required': '전화번호를 입력해 주세요.',
  'addressRoad is required': '주소를 입력해 주세요.',
  'regionSido is required': '시/도를 입력해 주세요.',
  'regionSigungu is required': '시/군/구를 입력해 주세요.',
  'Court not found': '연결된 코트를 찾을 수 없습니다.',
  'Submission not found': '제보를 찾을 수 없습니다.',
}

function getFieldLabel(field: string) {
  return FIELD_LABELS[field] ?? field
}

function translateServerMessage(message: string, field?: string) {
  const trimmed = message.trim()
  if (!trimmed) {
    return field ? `${getFieldLabel(field)} 입력값을 확인해 주세요.` : '입력값을 확인해 주세요.'
  }

  if (RAW_MESSAGE_TO_KOREAN[trimmed]) {
    return RAW_MESSAGE_TO_KOREAN[trimmed]
  }

  if (/[가-힣]/.test(trimmed)) {
    return trimmed
  }

  const label = field ? getFieldLabel(field) : '입력값'

  if (trimmed === 'is required' || trimmed.includes('must not be empty')) {
    return `${label} 입력은 필수입니다.`
  }
  if (trimmed.includes('must be an URL') || trimmed.includes('must be a valid URL')) {
    return `${label} 형식을 확인해 주세요.`
  }
  if (trimmed.includes('must be a string')) {
    return `${label} 형식을 확인해 주세요.`
  }
  if (trimmed.includes('must be') || trimmed.includes('invalid')) {
    return `${label} 값을 확인해 주세요.`
  }
  if (field && trimmed.startsWith(`${field} `) && RAW_MESSAGE_TO_KOREAN[trimmed]) {
    return RAW_MESSAGE_TO_KOREAN[trimmed]
  }

  return trimmed
}

function normalizeFieldErrors(fieldErrors: unknown): ApiFieldErrors {
  if (!fieldErrors || typeof fieldErrors !== 'object' || Array.isArray(fieldErrors)) {
    return {}
  }

  return Object.entries(fieldErrors).reduce<ApiFieldErrors>((acc, [field, value]) => {
    const rawMessages = Array.isArray(value) ? value : typeof value === 'string' ? [value] : []
    const messages = rawMessages.map((message) => translateServerMessage(message, field))
    if (messages.length) {
      acc[field] = messages
    }
    return acc
  }, {})
}

function getPayloadMessage(payload: ApiErrorPayload, fieldErrors: ApiFieldErrors) {
  const { message } = payload

  if (typeof message === 'string') {
    return translateServerMessage(message)
  }

  if (Array.isArray(message)) {
    const firstMessage = message.find(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    )
    if (firstMessage) {
      return translateServerMessage(firstMessage)
    }
  }

  const firstFieldMessage = Object.values(fieldErrors).flat()[0]
  if (firstFieldMessage) {
    return firstFieldMessage
  }

  if (typeof payload.error === 'string' && /[가-힣]/.test(payload.error)) {
    return payload.error
  }

  return '요청 내용을 확인해 주세요.'
}

async function parseErrorPayload(response: Response) {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return (await response.json()) as ApiErrorPayload
  }

  const text = await response.text()
  try {
    return JSON.parse(text) as ApiErrorPayload
  } catch {
    return { message: text }
  }
}

export class ApiError extends Error {
  status: number
  fieldErrors: ApiFieldErrors

  constructor(status: number, message: string, fieldErrors: ApiFieldErrors = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

export function getApiErrorDetails(error: unknown) {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      fieldErrors: error.fieldErrors,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message || '요청 처리 중 오류가 발생했습니다.',
      fieldErrors: {},
    }
  }

  return {
    message: '요청 처리 중 오류가 발생했습니다.',
    fieldErrors: {},
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })

  if (!response.ok) {
    const payload = await parseErrorPayload(response)
    const fieldErrors = normalizeFieldErrors(payload.fieldErrors)
    const message = getPayloadMessage(payload, fieldErrors)
    throw new ApiError(response.status, message, fieldErrors)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

function withQuery(path: string, query?: object) {
  if (!query) return path
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value))
    }
  })
  const qs = params.toString()
  return qs ? `${path}?${qs}` : path
}

export const fetchCourts = (query: CourtFilterQuery = {}) =>
  request<CourtResponse[]>(withQuery('/courts', query))

export const fetchCourt = (id: string) => request<CourtResponse>(`/courts/${id}`)

export const fetchSubmissions = (query: SubmissionFilterQuery = {}) =>
  request<SubmissionResponse[]>(withQuery('/submissions', query))

export const createSubmission = (payload: CreateSubmissionBody) =>
  request<SubmissionResponse>('/submissions', { method: 'POST', body: JSON.stringify(payload) })

export const updateSubmissionStatus = (id: string, status: UpdateSubmissionStatusBody['status']) =>
  request<SubmissionResponse>(`/submissions/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })

export const updateCourt = (id: string, payload: UpdateCourtBody) =>
  request<CourtResponse>(`/courts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })

export const deleteCourt = (id: string) =>
  request<void>(`/courts/${id}`, {
    method: 'DELETE',
  })
