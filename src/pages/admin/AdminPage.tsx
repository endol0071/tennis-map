import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { deleteCourt, fetchCourts, fetchSubmissions, updateCourt, updateSubmissionStatus } from '../../lib/api'
import { SubmissionRow } from './components/SubmissionRow'
import { SubmissionDetailModal } from './components/SubmissionDetailModal'
import type { Submission } from './types'
import type { UpdateCourtBody } from '../../types/domain'

const filterButtons: { key: 'all' | Submission['status']; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'pending', label: '대기' },
  { key: 'approved', label: '승인' },
  { key: 'rejected', label: '반려' },
]

const filterLabelByStatus: Record<'all' | Submission['status'], string> = {
  all: '전체',
  pending: '대기',
  approved: '승인',
  rejected: '반려',
}

const toCourtSlug = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^\w\uAC00-\uD7A3\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

function AdminPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'all' | Submission['status']>('all')
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null)
  const [selectedSubmissionSnapshot, setSelectedSubmissionSnapshot] = useState<Submission | null>(null)
  const queryClient = useQueryClient()
  const { data: submissions = [], isLoading, isError } = useQuery({
    queryKey: ['submissions', status],
    queryFn: () => fetchSubmissions({ status: status === 'all' ? undefined : status, limit: 200 }),
  })
  const { data: courts = [] } = useQuery({
    queryKey: ['courts', 'admin'],
    queryFn: () => fetchCourts({ limit: 500 }),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Submission['status'] }) =>
      updateSubmissionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
      queryClient.invalidateQueries({ queryKey: ['courts'] })
    },
  })

  const courtUpdateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCourtBody }) => updateCourt(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
      queryClient.invalidateQueries({ queryKey: ['courts'] })
    },
  })

  const courtDeleteMutation = useMutation({
    mutationFn: (id: string) => deleteCourt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
      queryClient.invalidateQueries({ queryKey: ['courts'] })
    },
  })

  const handleUpdateStatus = async (id: string, nextStatus: Submission['status']) => {
    return statusMutation.mutateAsync({ id, status: nextStatus })
  }

  const handleSaveCourt = async (id: string, payload: UpdateCourtBody) => {
    return courtUpdateMutation.mutateAsync({ id, payload })
  }

  const handleDeleteCourt = async (id: string) => {
    await courtDeleteMutation.mutateAsync(id)
    setSelectedSubmissionId(null)
    setSelectedSubmissionSnapshot(null)
  }

  const updatingId = statusMutation.variables?.id

  const filtered = submissions
  const liveSelectedSubmission = useMemo(
    () => submissions.find((item) => item.id === selectedSubmissionId) ?? null,
    [submissions, selectedSubmissionId],
  )

  const selectedSubmission = liveSelectedSubmission ?? selectedSubmissionSnapshot

  const selectedCourtId = useMemo(() => {
    if (!selectedSubmission) return null

    const direct = courts.find((court) => court.id === selectedSubmission.id)
    if (direct) return direct.id

    const slug = toCourtSlug(selectedSubmission.name)
    if (slug) {
      const bySlug = courts.find((court) => court.id === slug)
      if (bySlug) return bySlug.id
    }

    const naverMapUrl = selectedSubmission.naverMapUrl?.trim()
    if (naverMapUrl) {
      const byMapUrl = courts.filter((court) => court.naverMapUrl?.trim() === naverMapUrl)
      if (byMapUrl.length === 1) return byMapUrl[0].id
    }

    const phone = selectedSubmission.phone?.trim()
    if (phone) {
      const byPhone = courts.filter((court) => court.phone?.trim() === phone)
      if (byPhone.length === 1) return byPhone[0].id
    }

    const strictMatches = courts.filter(
      (court) =>
        court.name === selectedSubmission.name &&
        court.addressRoad === selectedSubmission.addressRoad &&
        court.regionSido === selectedSubmission.regionSido &&
        court.regionSigungu === selectedSubmission.regionSigungu,
    )
    if (strictMatches.length === 1) return strictMatches[0].id

    const relaxedMatches = courts.filter(
      (court) =>
        court.name === selectedSubmission.name &&
        court.regionSido === selectedSubmission.regionSido &&
        court.regionSigungu === selectedSubmission.regionSigungu,
    )
    if (relaxedMatches.length === 1) return relaxedMatches[0].id

    return null
  }, [courts, selectedSubmission])
  const selectedCourt = useMemo(
    () => (selectedCourtId ? courts.find((court) => court.id === selectedCourtId) ?? null : null),
    [courts, selectedCourtId],
  )

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/')
  }

  const handleSelectSubmission = (submission: Submission) => {
    setSelectedSubmissionId(submission.id)
    setSelectedSubmissionSnapshot(submission)
  }

  const handleSubmissionModalOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedSubmissionId(null)
      setSelectedSubmissionSnapshot(null)
    }
  }

  return (
    <div className="space-y-6 pb-16">
      <header className="-mx-4 -mt-4 border-b border-slate-200 bg-white">
        <div className="relative flex h-14 items-center px-4">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-lime-400 text-xs font-bold text-slate-900 shadow-sm">
              TM
            </div>
            <p className="text-lg font-bold text-slate-900">테니스맵</p>
          </div>

          <button
            type="button"
            onClick={handleGoBack}
            aria-label="뒤로가기"
            className="relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setStatus(btn.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ring-1 ${
              status === btn.key
                ? 'bg-emerald-500 text-white ring-emerald-300'
                : 'bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200'
            }`}
          >
            {btn.label}
          </button>
        ))}
        <span className="rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-200">
          총 {filtered.length}건
        </span>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-20 animate-pulse rounded-xl bg-slate-50" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          제보 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </div>
      )}

      {!isLoading && !isError && (
        filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((item) => (
              <SubmissionRow key={item.id} submission={item} onSelect={handleSelectSubmission} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
            <p className="text-sm font-semibold text-slate-800">조건에 맞는 제보가 없습니다.</p>
            <p className="mt-2 text-sm text-slate-500">
              현재 `{filterLabelByStatus[status]}` 상태에는 표시할 제보가 없습니다.
            </p>
          </div>
        )
      )}

      <SubmissionDetailModal
        key={selectedSubmission?.id ?? 'submission-detail-empty'}
        submission={selectedSubmission}
        courtId={selectedCourtId}
        court={selectedCourt}
        open={selectedSubmission !== null}
        onOpenChange={handleSubmissionModalOpenChange}
        onSaveCourt={handleSaveCourt}
        onDeleteCourt={handleDeleteCourt}
        onChangeStatus={handleUpdateStatus}
        updatingStatus={statusMutation.isPending && updatingId === selectedSubmission?.id}
        savingCourt={courtUpdateMutation.isPending}
        deletingCourt={courtDeleteMutation.isPending}
      />
    </div>
  )
}

export default AdminPage
