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
import PatientSurveyFormPage from './pages/patient-survey-form'
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
import PatientSurveysPage from './pages/patients/patient-surveys'
import TreatmentsSurveysPage from './pages/treatments-surveys/treatments-surveys'
import TreatmentSurveyFormPage from './pages/treatments-surveys/treatment-survey-form'
import TreatmentSurveyPage from './pages/treatments-surveys/treatment-survey'
import PatientTreatmentSurveysPage from './pages/patients/patient-treatment-surveys'
import CommentsPage from './pages/comments'

import ArrivalMethodsPage from './pages/arrival-methods/arrival-methods'

import LeadsPage from './pages/CRM/leads'
import MeetingsPage from './pages/CRM/meetings'
import StagesPage from './pages/CRM/stages'
import LeadLayout from './components/layouts/lead-layout'
import LeadsStagesPage from './pages/CRM/leads/leads-stages'
import LeadsMeetingsPage from './pages/CRM/leads/leads-meetings'
import MessagesTemplatesPage from './pages/CRM/messages/messages-templates'
import MessagesSentPage from './pages/CRM/messages/messages-sent'
import ValuesPage from './pages/values/values'

import DashboardPage from './pages/dashboard'

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
            <Route path="/treatments-surveys" element={<TreatmentsSurveysPage roles={['EMPLOYEE']} />} />
            <Route path="/patients-surveys/:surveyId" element={<PatientSurveyPage roles={['EMPLOYEE']} />} />
            <Route path="/treatments-surveys/:surveyId" element={<TreatmentSurveyPage roles={['EMPLOYEE']} />} />
            <Route path="/subscriptions" element={<SubscriptionsPage roles={['ADMIN']} />} />
            <Route path="/appointments" element={<AppointmentsPage roles={['STAFF', 'DOCTOR', 'OWNER']} />} />
            <Route path="/prescriptions" element={<PrescriptionsPage roles={['DOCTOR', 'STAFF']} />} />
            <Route path="/clinics/:clinicId/patients/:patientId/treatment-survey/form" element={<TreatmentSurveyFormPage roles={['EMPLOYEE']}/>} />
            <Route path="/clinics/:clinicId/patients/:patientId/patient-survey/form" element={<PatientSurveyFormPage roles={['EMPLOYEE']}/>} />
            <Route path="/patients-surveys/:patientSurveyId/patient-survey/form" element={<PatientSurveyFormPage roles={['EMPLOYEE']}/>} />
            <Route path="/treatments-surveys/:id/treatment-survey/form" element={<TreatmentSurveyFormPage roles={['EMPLOYEE']}/>} />
            <Route path="/encounters/:id/update" element={<UpdateEncountersFormPage roles={['DOCTOR']} />} />
            <Route path="/prescriptions/:id/update" element={<UpdatePrescriptionsFormPage roles={['DOCTOR']} />} />
            <Route path="/prescriptions/patients/:id" element={<PrescriptionPage roles={['DOCTOR', 'STAFF']} />} />

            <Route path="/arrival-methods" element={<ArrivalMethodsPage roles={['EMPLOYEE', 'ADMIN']} />} />
            <Route path="/comments" element={<CommentsPage roles={['ADMIN']} />} />
            <Route path="/values" element={<ValuesPage roles={['ADMIN']} />} />

            <Route path="/crm/leads" element={<LeadsPage roles={[]} />} />
            <Route path="/crm/meetings" element={<MeetingsPage roles={[]} />} />
            <Route path="/crm/stages" element={<StagesPage roles={[]} />} />
            <Route path="/crm/messages-templates" element={<MessagesTemplatesPage roles={[]} />} />
            <Route path="/messages-sent" element={<MessagesSentPage roles={[]} />} />

            <Route element={<LeadLayout />}>
              <Route path="/crm/leads/:leadId/stages" element={<LeadsStagesPage roles={[]} />} />
              <Route path="/crm/leads/:leadId/meetings" element={<LeadsMeetingsPage roles={[]} />} />
            </Route>

            <Route path="/dashboard" element={<DashboardPage />} />

            <Route element={<PatientProfileLayout />}>
              <Route path="/patients/:id/clinics/:clinicId/medical-profile" element={<PatientMedicalPage roles={['STAFF', 'DOCTOR', 'OWNER']}/>} />
              <Route path="/patients/:id/clinics/:clinicId/emergency-contacts" element={<PatientEmergencyContactsPage roles={['STAFF', 'DOCTOR', 'OWNER']} />} />
              <Route path="/patients/:id/clinics/:clinicId/prescriptions" element={<PatientPrescriptionsPage roles={['DOCTOR']} />} />
              <Route path="/patients/:id/clinics/:clinicId/drugs" element={<PatientDrugsPage roles={['DOCTOR', 'STAFF']} />} />
              <Route path="/patients/:id/clinics/:clinicId/appointments" element={<PatientAppointmentsPage roles={['DOCTOR', 'STAFF']} />} />
              <Route path="/patients/:id/clinics/:clinicId/patients-surveys" element={<PatientSurveysPage roles={['EMPLOYEE', 'ADMIN']} />} />
              <Route path="/patients/:id/clinics/:clinicId/treatments-surveys" element={<PatientTreatmentSurveysPage roles={['EMPLOYEE', 'ADMIN']} />} />

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
