import { NavLink, Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-4 pb-28 pt-4">
        <main className="space-y-6">
          <Outlet />
        </main>

        <footer className="mt-10 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-xs text-slate-500 shadow-sm">
          <p>Tennis Map · 테니스장 정보 표준화</p>
          <p className="text-slate-500">모바일 중심 레이아웃 · 데이터 연동 준비</p>
        </footer>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-around px-6 py-3 text-sm font-semibold">
          {[
            { to: '/', label: '홈', icon: '🏠' },
            { to: '/submit', label: '제보', icon: '➕' },
            { to: '/admin', label: '관리', icon: '🛠️' },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition ${
                  isActive ? 'bg-emerald-500 text-white' : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default App
