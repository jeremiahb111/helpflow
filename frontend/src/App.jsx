import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import TicketPage from './pages/TicketPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import useAuth from './hooks/useAuth'
import PageLoader from './components/PageLoader'
import Layout from './components/Layout'
import { Toaster } from 'sonner'
import UsersPage from './pages/UsersPage'

const App = () => {
  const { authUser, isLoading } = useAuth()

  const isAuthenticated = Boolean(authUser?.isActive)
  const isAdmin = authUser?.role === 'admin'

  if (isLoading) return <PageLoader />

  return (
    <div className="h-screen" data-theme="light">
      <Routes>
        <Route path="/" element={isAuthenticated ? (
          <Layout>
            <HomePage />
          </Layout>
        ) : (
          <Navigate to="/login" />
        )} />
        <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/tickets/:id" element={isAuthenticated ? (
          <Layout>
            <TicketPage />
          </Layout>
        ) : <Navigate to="/login" />} />
        <Route path="/users" element={isAuthenticated && isAdmin ? (
          <Layout>
            <UsersPage />
          </Layout>
        ) : (
          <Navigate to="/login" />
        )} />
      </Routes>
      <Toaster position='top-center' richColors />
    </div>
  )
}
export default App