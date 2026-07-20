import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/common/MainLayout'
import HomePage from './pages/HomePage'
import ListingDetailPage from './pages/ListingDetailPage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MyBookingsPage from './pages/MyBookingsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="listing/:id"    element={<ListingDetailPage />} />
        <Route path="checkout/:id"   element={<CheckoutPage />} />
        <Route path="login"          element={<LoginPage />} />
        <Route path="register"       element={<RegisterPage />} />
        <Route path="my-bookings"    element={<MyBookingsPage />} />
        <Route path="*"              element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}