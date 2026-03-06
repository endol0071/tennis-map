import { SubmitForm } from './components/SubmitForm'
import { useSubmitForm } from './hooks/useSubmitForm'
import { useNavigate } from 'react-router-dom'

function SubmitPage() {
  const navigate = useNavigate()
  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/')
  }

  const {
    form,
    isDraftCourtLayoutOpen,
    draftCourtLayout,
    courtLayoutError,
    submitted,
    submitting,
    error,
    update,
    toggleAmenity,
    openDraftCourtLayout,
    cancelDraftCourtLayout,
    updateDraftCourtLayout,
    confirmCourtLayout,
    removeCourtLayout,
    reset,
    handleSubmit,
  } = useSubmitForm({ onSuccess: () => navigate('/') })

  return (
    <div className="space-y-6 pb-16">
      <header className="-mx-4 -mt-4 border-b border-slate-200 bg-white">
        <div className="relative flex h-14 items-center px-4">
          <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none">
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

      <SubmitForm
        form={form}
        isDraftCourtLayoutOpen={isDraftCourtLayoutOpen}
        draftCourtLayout={draftCourtLayout}
        courtLayoutError={courtLayoutError}
        submitted={submitted}
        submitting={submitting}
        errorMessage={error ? (error as Error).message : ''}
        onChange={update}
        onToggleAmenity={toggleAmenity}
        onOpenDraftCourtLayout={openDraftCourtLayout}
        onCancelDraftCourtLayout={cancelDraftCourtLayout}
        onChangeDraftCourtLayout={updateDraftCourtLayout}
        onConfirmCourtLayout={confirmCourtLayout}
        onRemoveCourtLayout={removeCourtLayout}
        onReset={reset}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default SubmitPage
