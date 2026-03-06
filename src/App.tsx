import { Link, Outlet, useLocation } from 'react-router-dom'

function App() {
  const { pathname } = useLocation()
  const showSubmitFab = pathname === '/'

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-4 pb-8 pt-4">
        <main className="space-y-6">
          <Outlet />
        </main>
      </div>
      {showSubmitFab && (
        <Link
          to="/submit"
          className="fixed bottom-6 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-300 transition hover:brightness-110 sm:right-6"
        >
          <span className="text-base leading-none">+</span>
          제보하기
        </Link>
      )}
    </div>
  )
}

export default App
