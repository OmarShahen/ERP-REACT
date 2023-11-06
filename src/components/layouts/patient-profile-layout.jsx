import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { serverRequest } from '../../components/API/request'
import { setPatient } from '../../redux/slices/patientSlice'
import { useDispatch, useSelector } from 'react-redux'
import translations from '../../i18n'
import QuickFormMenu from '../menus/quick-forms/quick-forms'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import AppointmentFormModal from '../modals/appointment-form'

const PatientProfileLayout = () => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]
    const clinicId = pagePath.split('/')[4]

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const dispatch = useDispatch()
    const [showQuickActionsForm, setShowQuickActionsForm] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [patientProfile, setPatientProfile] = useState({})

    const [isShowAppointmentsForm, setIsShowAppointmentsForm] = useState(false)
    const [isShowEmergencyContactsForm, setIsShowEmergencyContactsForm] = useState(false)
    const [isShowInsurancePolicy, setIsShowInsurancePolicy] = useState(false)

    useEffect(() => scroll(0,0), [])
    
    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/patients/${patientId}`)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setPatientProfile(data.patient)
            dispatch(setPatient(data.patient))
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [])


    return <div className="page-container">
        { isShowAppointmentsForm ? <AppointmentFormModal setShowFormModal={setIsShowAppointmentsForm} /> : null }
        <div className="padded-container">
        <div className="page-header-wrapper">
                    <div className="back-button-container">
                        <ArrowBackIcon />
                        <span onClick={e => navigate(-1)}>{translations[lang]['Back']}</span>
                    </div>
                    <div className="page-header-container">
                        <div>
                            <h1>
                                { isLoading ? 'Loading...' : `${patientProfile?.firstName} ${patientProfile?.lastName ? patientProfile.lastName : ''}` }
                            </h1>
                        </div>
                        <div className="btns-container subheader-text quick-form-container">
                            <button onClick={e => setShowQuickActionsForm(!showQuickActionsForm)}>
                                <AddOutlinedIcon />
                                <strong>
                                    {translations[lang]['Quick Actions']}
                                </strong>
                            </button>
                            { 
                            showQuickActionsForm ? 
                            <QuickFormMenu 
                            setShowAppointmentForm={setIsShowAppointmentsForm}
                            /> 
                            : 
                            null 
                            }
                        </div>
                    </div>
                </div>
            <div className="mini-page-navigator-container">
                <ul>
                    <li><NavLink to={`/patients/${patientId}/clinics/${clinicId}/medical-profile`}>{translations[lang]['Profile']}</NavLink></li> 
                    <li><NavLink to={`/patients/${patientId}/clinics/${clinicId}/patients-surveys`}>Patient Surveys</NavLink></li>
                    <li><NavLink to={`/patients/${patientId}/clinics/${clinicId}/treatments-surveys`}>Treatment Surveys</NavLink></li>
                </ul>
            </div>
            <Outlet />
        </div>
    </div>
}

export default PatientProfileLayout