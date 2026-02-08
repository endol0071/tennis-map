import { SubmitForm } from './components/SubmitForm'
import { useSubmitForm } from './hooks/useSubmitForm'

function SubmitPage() {
  const { form, submitted, update, toggleAmenity, reset, handleSubmit } = useSubmitForm()

  return (
    <div className="space-y-8 pb-16">
      <section className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-lg shadow-emerald-50">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">등록 제보</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">새로운 테니스장 정보를 알려주세요.</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          제출된 정보는 운영자 검수 후 공개됩니다. 필수 항목만 채워도 등록 요청을 받을 수 있으며, 가격·예약 링크·편의시설은
          선택 입력입니다.
        </p>
      </section>

      <SubmitForm
        form={form}
        submitted={submitted}
        onChange={update}
        onToggleAmenity={toggleAmenity}
        onReset={reset}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default SubmitPage
