import './App.css'
import LoginPage from './pages/auth/login'
import ForgotPasswordPage from './pages/auth/forgot-password'
import ForgotPasswordVerificationCodePage from './pages/auth/forgot-password-verification-code'
import ResetPasswordPage from './pages/auth/reset-password'
import { Toaster } from 'react-hot-toast'
import MainLayout from './components/layouts/main-layout'
import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom'
import SpecialtiesPage from './pages/specialties'
import ItemsPage from './pages/items'
import DashboardV2Page from './pages/dashboard-v2'
import POSPage from './pages/pos'
import OrdersPage from './pages/orders'
import EmployeesPage from './pages/employees'
import SuppliersPage from './pages/suppliers'
import StockRecordsPage from './pages/stock-records'
import ShiftsPage from './pages/shifts'


function App() {

  const user = useSelector(state => state.user.user)

  return (
    <div className="App">
      <Router>
        <Toaster />

        <Routes>

          <Route path="/" element={<Navigate to="/login" />} />

          <Route element={user.isLogged ? <MainLayout /> : <LoginPage />}>
            
            <Route path="/specialties" element={<SpecialtiesPage roles={['ADMIN', 'EMPLOYEE']} />} />

            <Route path="/pos" element={<POSPage roles={['ADMIN', 'EMPLOYEE']} />} />
            <Route path="/employees" element={<EmployeesPage roles={['ADMIN']} />} />
            <Route path="/suppliers" element={<SuppliersPage roles={['ADMIN']} />} />
            <Route path="/shifts" element={<ShiftsPage roles={['ADMIN', 'EMPLOYEE']} />} />
            <Route path="/orders" element={<OrdersPage roles={['ADMIN', 'EMPLOYEE']} />} />
            <Route path="/items" element={<ItemsPage roles={['ADMIN', 'EMPLOYEE']} />} />
            <Route path="/stock-records" element={<StockRecordsPage roles={['ADMIN', 'EMPLOYEE']} />} />

            <Route path="/dashboard" element={<DashboardV2Page roles={['ADMIN']} />} />

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
