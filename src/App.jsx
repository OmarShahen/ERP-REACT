import './App.css'
import AppointmentsPage from './pages/appointments'
import ProfilePage from './pages/profile/profile'
import SpecialityPage from './pages/profile/speciality'
import PasswordPage from './pages/profile/password'
import DeleteAccountPage from './pages/profile/delete-account'
import LoginPage from './pages/auth/login'
import ForgotPasswordPage from './pages/auth/forgot-password'
import ForgotPasswordVerificationCodePage from './pages/auth/forgot-password-verification-code'
import ResetPasswordPage from './pages/auth/reset-password'
import { Toaster } from 'react-hot-toast'
import MainLayout from './components/layouts/main-layout'
import UserProfileLayout from './components/layouts/user-profile-layout'

import UsersPage from './pages/experts'

import DashboardPage from './pages/dashboard'

import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom'
import ReviewsPage from './pages/reviews'
import SpecialtiesPage from './pages/specialties'
import SpecialtyPage from './pages/specialty'
import SeekersPage from './pages/seekers'
import PaymentsPage from './pages/payments'
import ExpertsVerificationsPage from './pages/expertsVerifications'
import PromoCodesPage from './pages/promo-codes'
import QuestionsPage from './pages/questions'
import SettingsPage from './pages/settings'
import ExpertPaymentsPage from './pages/experts/expert-payments'
import ExpertProfileLayout from './components/layouts/expert-profile-layout'
import ExpertServicesPage from './pages/experts/expert-services'
import ExpertOpeningTimesPage from './pages/experts/expert-opening-times'
import ExpertAppointmentsPage from './pages/experts/expert-appointments'
import BrandsPage from './pages/brands'
import CustomersPage from './pages/customers'
import ItemsPage from './pages/items'
import CustomerItemsPage from './pages/customer-items'
import ItemImagesPage from './pages/item-images'
import DashboardV2Page from './pages/dashboard-v2'


function App() {

  const user = useSelector(state => state.user.user)

  return (
    <div className="App">
      <Router>
        <Toaster />

        <Routes>

          <Route path="/" element={<Navigate to="/login" />} />

          <Route element={user.isLogged ? <MainLayout /> : <LoginPage />}>
            

            <Route path="/reviews" element={<ReviewsPage roles={[]} />} />
            <Route path="/specialties" element={<SpecialtiesPage roles={[]} />} />
            <Route path="/specialties/:id" element={<SpecialtyPage roles={[]} />} />

            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/customers" element={<CustomersPage roles={['ADMIN', 'EMPLOYEE']} />} />
            <Route path="/items" element={<ItemsPage roles={['ADMIN', 'EMPLOYEE']} />} />
            <Route path="/items/customers/:id" element={<CustomerItemsPage roles={['ADMIN', 'EMPLOYEE']} />} />
            <Route path="/items/:id/images" element={<ItemImagesPage roles={['ADMIN', 'EMPLOYEE']} />} />
            <Route path="/users/experts" element={<UsersPage roles={['ADMIN', 'EMPLOYEE']} />} />
            <Route path="/users/seekers" element={<SeekersPage roles={['ADMIN', 'EMPLOYEE']} />} />
            <Route path="/experts-verifications" element={<ExpertsVerificationsPage roles={['ADMIN', 'EMPLOYEE']} />} />
            <Route path="/promo-codes" element={<PromoCodesPage roles={['ADMIN', 'EMPLOYEE']} />} />
            <Route path="/questions" element={<QuestionsPage roles={['ADMIN', 'EMPLOYEE']} />} />
            <Route path="/settings" element={<SettingsPage roles={['ADMIN', 'EMPLOYEE']} />} />

            {/*<Route path="/dashboard" element={<DashboardPage />} />*/}
            <Route path="/dashboard" element={<DashboardV2Page roles={['ADMIN', 'EMPLOYEE']} />} />

            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />

            <Route element={<ExpertProfileLayout />}>
              <Route path="/experts/:id/appointments" element={<ExpertAppointmentsPage roles={['ADMIN', 'EMPLOYEE']} />} />
              <Route path="/experts/:id/payments" element={<ExpertPaymentsPage roles={['ADMIN', 'EMPLOYEE']} />} />
              <Route path="/experts/:id/services" element={<ExpertServicesPage roles={['ADMIN', 'EMPLOYEE']} />} />
              <Route path="/experts/:id/schedule" element={<ExpertOpeningTimesPage roles={['ADMIN', 'EMPLOYEE']} />} />
            </Route>

            <Route element={<UserProfileLayout />}>
              <Route path="/settings/profile" element={<ProfilePage roles={['DOCTOR', 'STAFF', 'OWNER']} />} />
              <Route path="/settings/password" element={<PasswordPage roles={['DOCTOR', 'STAFF', 'OWNER']} />} />
              <Route path="/settings/speciality" element={<SpecialityPage roles={['DOCTOR']} />} />
              <Route path="/settings/account-delete" element={<DeleteAccountPage roles={['DOCTOR', 'STAFF', 'OWNER']} />} />
            </Route>

       
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:email" element={<ForgotPasswordVerificationCodePage />} />
          <Route path="reset-password/:email/:verificationCode" element={<ResetPasswordPage />} />

        </Routes>
      </Router>
      <div className="page-bottom-margin"></div>
    </div>
  )
}

export default App
