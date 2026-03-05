import type { Court, Submission, SubmissionPayload } from '../types/domain';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || '요청에 실패했습니다.');
  }

  return response.json() as Promise<T>;
}

export const fetchCourts = () => request<Court[]>('/courts');

export const fetchCourt = (id: string) => request<Court>(`/courts/${id}`);

export const fetchSubmissions = () => request<Submission[]>('/submissions');

export const createSubmission = (payload: SubmissionPayload) =>
  request<Submission>('/submissions', { method: 'POST', body: JSON.stringify(payload) });

export const updateSubmissionStatus = (id: string, status: Submission['status']) =>
  request<Submission>(`/submissions/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
