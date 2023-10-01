import './App.css'
import PrescriptionsPage from './pages/prescriptions'
import PatientsPage from './pages/patients'
import PatientMedicalPage from './pages/patients/patient-medical'
import AppointmentsPage from './pages/appointments'
import SettingsPage from './pages/settings'
import ProfilePage from './pages/profile/profile'
import SpecialityPage from './pages/profile/speciality'
import PasswordPage from './pages/profile/password'
import DeleteAccountPage from './pages/profile/delete-account'
import LoginPage from './pages/auth/login'
import ForgotPasswordPage from './pages/auth/forgot-password'
import ForgotPasswordVerificationCodePage from './pages/auth/forgot-password-verification-code'
import ResetPasswordPage from './pages/auth/reset-password'
import { Toaster } from 'react-hot-toast'
import PatientEmergencyContactsPage from './pages/patients/patient-emergency-contacts'
import PatientPrescriptionsPage from './pages/patients/patient-prescriptions'
import PatientDrugsPage from './pages/patients/patient-drugs'
import PatientAppointmentsPage from './pages/patients/patient-appointments'
import UpdateEncountersFormPage from './pages/update-encounter-form'
import UpdatePrescriptionsFormPage from './pages/update-prescription-form'
import PatientFormPage from './pages/patient-survey-form'
import SupportPage from './pages/support/support'
import EncounterPage from './pages/encounter'
import PrescriptionPage from './pages/prescription'
import MainLayout from './components/layouts/main-layout'
import PatientProfileLayout from './components/layouts/patient-profile-layout'
import UserProfileLayout from './components/layouts/user-profile-layout'
import ClinicProfileLayout from './components/layouts/clinic-profile-layout'
import ClinicProfilePage from './pages/clinic-profile/clinic-info'
import ClinicServicesPage from './pages/clinic-profile/clinic-services'

import UsersPage from './pages/users'
import ClinicsLayout from './components/layouts/clinic-layout'

import ClinicsPage from './pages/clinics'
import SubscribedClinicsPage from './pages/subscribed-clinics'
import SubscriptionsPage from './pages/subscriptions'
import PatientsSurveysPage from './pages/patients-surveys'
import PatientSurveyPage from './pages/patient-survey'

import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom'


function App() {

  const user = useSelector(state => state.user.user)

  return (
    <div className="App">
      <Router>
        <Toaster />

        <Routes>

          <Route path="/" element={<Navigate to="/login" />} />

          <Route element={user.isLogged ? <MainLayout /> : <LoginPage />}>
            <Route path="/users" element={<UsersPage roles={['ADMIN']} />} />
            <Route path="/patients-surveys" element={<PatientsSurveysPage roles={['EMPLOYEE']} />} />
            <Route path="/patients-surveys/:surveyId" element={<PatientSurveyPage roles={['EMPLOYEE']} />} />
            <Route path="/subscriptions" element={<SubscriptionsPage roles={['ADMIN']} />} />
            <Route path="/appointments" element={<AppointmentsPage roles={['STAFF', 'DOCTOR', 'OWNER']} />} />
            <Route path="/prescriptions" element={<PrescriptionsPage roles={['DOCTOR', 'STAFF']} />} />
            <Route path="/clinics/:clinicId/patients/:patientId/patient-survey/form" element={<PatientFormPage roles={['EMPLOYEE']}/>} />
            <Route path="/patients-surveys/:patientSurveyId/patient-survey/form" element={<PatientFormPage roles={['EMPLOYEE']}/>} />
            <Route path="/encounters/:id/update" element={<UpdateEncountersFormPage roles={['DOCTOR']} />} />
            <Route path="/prescriptions/:id/update" element={<UpdatePrescriptionsFormPage roles={['DOCTOR']} />} />
            <Route path="/prescriptions/patients/:id" element={<PrescriptionPage roles={['DOCTOR', 'STAFF']} />} />
        
            <Route element={<PatientProfileLayout />}>
              <Route path="/patients/:id/clinics/:clinicId/medical-profile" element={<PatientMedicalPage roles={['STAFF', 'DOCTOR', 'OWNER']}/>} />
              <Route path="/patients/:id/clinics/:clinicId/emergency-contacts" element={<PatientEmergencyContactsPage roles={['STAFF', 'DOCTOR', 'OWNER']} />} />
              <Route path="/patients/:id/clinics/:clinicId/prescriptions" element={<PatientPrescriptionsPage roles={['DOCTOR']} />} />
              <Route path="/patients/:id/clinics/:clinicId/drugs" element={<PatientDrugsPage roles={['DOCTOR', 'STAFF']} />} />
              <Route path="/patients/:id/clinics/:clinicId/appointments" element={<PatientAppointmentsPage roles={['DOCTOR', 'STAFF']} />} />
            </Route>


            <Route element={<ClinicsLayout roles={[]} />}>
              <Route path="/clinics/all" element={<ClinicsPage roles={[]} />} />
              <Route path="/clinics/subscribed" element={<SubscribedClinicsPage roles={[]} />} />
            </Route>

            <Route element={<UserProfileLayout />}>
              <Route path="/settings/profile" element={<ProfilePage roles={['DOCTOR', 'STAFF', 'OWNER']} />} />
              <Route path="/settings/password" element={<PasswordPage roles={['DOCTOR', 'STAFF', 'OWNER']} />} />
              <Route path="/settings/speciality" element={<SpecialityPage roles={['DOCTOR']} />} />
              <Route path="/settings/account-delete" element={<DeleteAccountPage roles={['DOCTOR', 'STAFF', 'OWNER']} />} />
            </Route>
            
            <Route path="/patients" element={<PatientsPage roles={['DOCTOR', 'STAFF', 'OWNER']} />} />
            <Route path="/encounters/:id/view" element={<EncounterPage roles={['DOCTOR']} />}/>
            <Route path="/prescriptions/:id/view" element={<PrescriptionPage roles={['DOCTOR', 'STAFF']} />} />

            <Route path="/settings" element={<SettingsPage roles={['DOCTOR', 'STAFF', 'OWNER']} />} />
            <Route path="/support" element={<SupportPage roles={['DOCTOR', 'STAFF', 'OWNER']} />} />

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
