import './quick-forms.css'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import translations from '../../../i18n'
import RingVolumeOutlinedIcon from '@mui/icons-material/RingVolumeOutlined'
import { closeInvoice, setInvoice, setInvoicePatientId, setIsActive } from '../../../redux/slices/invoiceSlice'
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined'
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined'


const QuickFormMenu = ({ 
    setShowInsuranceCompanyForm, 
    setShowPatientCardForm, 
    setShowAppointmentForm, 
    setShowInvoiceForm,
    setShowEmergencyContactForm,
    setShowInsurancePoliciesForm,
    setIsShowCommentForm
}) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    return <div className="quick-form-menu-container">
        <div className="quick-form-menu-header-container">
            <span>{translations[lang]['Quick Adds']}</span>
        </div>
        <div className="quick-form-list-container">
            <ul>
                <li onClick={e => setIsShowCommentForm(true)}>
                    <span>Comment</span>
                    <MapsUgcOutlinedIcon />
                </li>
                
                {/*
                    user.roles.includes('DOCTOR') || user.roles.includes('STAFF') ?
                    <li onClick={e => setShowEmergencyContactForm(true)}>
                        <span>{translations[lang]['Emergency Contacts']}</span>
                        <RingVolumeOutlinedIcon />
                    </li>
                    :
                    null
                */}
                {/*
                    user.roles.includes('STAFF') ?
                    <li onClick={e => setShowAppointmentForm(true)}>
                        <span>{translations[lang]['Appointment']}</span>
                        <CalendarMonthOutlinedIcon />
                    </li>
                    :
                    null
                */}
                {/*
                    user.roles.includes('STAFF') ?
                    <li 
                    onClick={e => {
                        dispatch(closeInvoice())
                        dispatch(setIsActive({ isActive: true }))
                        dispatch(setInvoicePatientId(patientId))
                        navigate('/services')
                    }}
                    >
                        <span>{translations[lang]['Invoices']}</span>
                        <ReceiptLongOutlinedIcon />
                    </li>
                    :
                    null
                */}
                {/*
                    user.roles.includes('STAFF') ?
                    <li onClick={e => setShowInsurancePoliciesForm(true)}>
                        <span>{translations[lang]['Insurance Policies']}</span>
                        <HealthAndSafetyOutlinedIcon />
                    </li>
                    :
                    null
                */}
                {/*
                    user.roles.includes('OWNER') ?
                    <li onClick={e => setShowInsuranceCompanyForm(true)}>
                        <span>Insurance Company</span>
                        <HomeWorkOutlinedIcon />
                    </li>
                    :
                    null
                */}
            </ul>
        </div>
    </div>
}

export default QuickFormMenu