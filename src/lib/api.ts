import type {
  CourtFilterQuery,
  CourtResponse,
  CreateSubmissionBody,
  SubmissionFilterQuery,
  SubmissionResponse,
  UpdateCourtBody,
  UpdateSubmissionStatusBody,
} from '../types/domain'

const PRODUCTION_API_BASE_URL = 'https://tennis-map-server-production.up.railway.app';
const DEFAULT_API_BASE_URL = import.meta.env.PROD
  ? PRODUCTION_API_BASE_URL
  : 'http://localhost:3000';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, '')

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || '요청에 실패했습니다.')
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
