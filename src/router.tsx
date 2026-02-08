import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import HomePage from './pages/home/HomePage'
import CourtDetailPage from './pages/court-detail/CourtDetailPage'
import SubmitPage from './pages/submit/SubmitPage'
import AdminPage from './pages/admin/AdminPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'courts/:id', element: <CourtDetailPage /> },
      { path: 'submit', element: <SubmitPage /> },
      { path: 'admin', element: <AdminPage /> },
    ],
  },
])
