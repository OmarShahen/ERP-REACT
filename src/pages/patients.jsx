import { useState, useEffect } from 'react'
import './prescriptions.css'
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import PatientFormModal from '../components/modals/patient-form'
import PatientCardJoinFormModal from '../components/modals/patient-card-join-form';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CircularLoading from '../components/loadings/circular'
import PatientCard from '../components/cards/patient'
import CachedIcon from '@mui/icons-material/Cached'
import FloatingButton from '../components/buttons/floating-button'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { searchPatients } from '../utils/searches/search-patients'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import PatientDeleteConfirmationModal from '../components/modals/confirmation/patient-delete-confirmation-modal'
import { toast } from 'react-hot-toast'
import { isRolesValid } from '../utils/roles'
import FiltersSection from '../components/sections/filters/filters'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import Card from '../components/cards/card'
import { formatNumber } from '../utils/numbers'
import translations from '../i18n'
import PageHeader from '../components/sections/page-header'
import PatientUpdateSurveyConfirmationModal from '../components/modals/confirmation/patient-update-survey-confirmation-modal'
import Sidebar from '../components/navigation/sidebar'


const PatientsPage = ({ roles }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isShowUpdateSurveyModal, setIsShowUpdateSurveyModal] = useState(false)
    const [isShowDeletePatientModel, setIsShowDeletePatientModal] = useState(false)
    const [isShowAddPatientForm, setIsShowAddPatientForm] = useState(false)
    const [targetPatient, setTargetPatient] = useState({})

    const [isUpdatePatient, setIsUpdatePatient] = useState(false)

    const [targetClinic, setTargetClinic] = useState()
    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [showPatientIdForm, setShowPatientIdForm] = useState(false)
    const [showPatientDataForm, setShowPatientDataForm] = useState(false)
    const [patients, setPatients] = useState([])
    const [searchedPatients, setSearchedPatients] = useState([])

    const [viewStatus, setViewStatus] = useState('ALL')

    const activeElementColor = { border: '2px solid #4c83ee', color: '#4c83ee' }

    const todayDate = new Date()
    const weekDate = new Date()

    todayDate.setDate(todayDate.getDate() + 1)
    weekDate.setDate(weekDate.getDate() - 7)

    const [statsQuery, setStatsQuery] = useState({ from: weekDate, to: todayDate })

    useEffect(() => { 
        scroll(0,0)
    }, [])

    useEffect(() => {
        setIsLoading(true)    
        const endpointURL = `/v1/patients/followup-service/clinics-subscriptions/active`  
        serverRequest.get(endpointURL,  { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setPatients(response.data.patients)
            setSearchedPatients(response.data.patients)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery])


    return <div className="page-container page-white-background">
        {
            isShowAddPatientForm ?
            <PatientFormModal 
            reload={reload} 
            setReload={setReload} 
            setShowModalForm={setIsShowAddPatientForm}  
            isUpdate={isUpdatePatient}
            setIsUpdate={setIsUpdatePatient}
            patient={targetPatient}
            />
            :
            null
        }
        {
            isShowDeletePatientModel ?
            <PatientDeleteConfirmationModal
            reload={reload}
            setReload={setReload}
            patient={targetPatient}
            setIsShowModal={setIsShowDeletePatientModal}
            />
            :
            null
        }
        { 
        isShowUpdateSurveyModal ? 
        <PatientUpdateSurveyConfirmationModal 
        patient={targetPatient}
        isSurveyed={!targetPatient?.survey?.isDone}
        reload={reload}
        setReload={setReload} 
        setIsShowModal={setIsShowUpdateSurveyModal}
        /> 
        : 
        null 
        }
        <div className="show-mobile">
            <FloatingButton setIsShowForm={setIsShowAddPatientForm} />
        </div>

            <div className="padded-container">
                <div>
                    <PageHeader 
                    pageName={'Patients'}
                    reload={reload}
                    setReload={setReload}
                    addBtnText={'Add Patient'}
                    setShowModalForm={setIsShowAddPatientForm}
                    />
                    <div className="cards-3-list-wrapper margin-bottom-1">
                        <Card 
                        icon={<NumbersOutlinedIcon />}
                        cardHeader={translations[lang]['Patients']}
                        number={formatNumber(searchedPatients.length)}
                        iconColor={'#5C60F5'}
                        />
                        <Card 
                        icon={<NumbersOutlinedIcon />}
                        cardHeader={'Done Surveys'}
                        number={formatNumber(patients.filter(patient => patient?.survey?.isDone).length)}
                        iconColor={'#5C60F5'}
                        />
                        <Card 
                        icon={<NumbersOutlinedIcon />}
                        cardHeader={'Waiting Surveys'}
                        number={formatNumber(patients.filter(patient => !patient?.survey?.isDone).length)}
                        iconColor={'#5C60F5'}
                        />
                    </div>
                <div>
            </div>
                
                    <FiltersSection 
                    setStatsQuery={setStatsQuery} 
                    statsQuery={statsQuery}
                    defaultValue={'-7'}
                    />
                    <div className="search-input-container">
                        <SearchInput 
                        rows={patients} 
                        setRows={setSearchedPatients}
                        searchRows={searchPatients}
                        setTargetClinic={setTargetClinic}
                        isHideClinics={user.roles.includes('STAFF') ? true : false }
                        />
                    </div>
                    <div className="appointments-categories-container cards-list-wrapper">
                        <div style={ viewStatus === 'ALL' ? activeElementColor : null } onClick={e => {
                            setViewStatus('ALL')
                            setSearchedPatients(patients.filter(patient => true))
                        }}>
                            {translations[lang]['All']}
                        </div>
                        <div style={ viewStatus === 'DONE' ?  activeElementColor : null } onClick={e => {
                            setViewStatus('DONE')
                            setSearchedPatients(patients.filter(patient => patient?.survey?.isDone))
                        }}>
                            {'Done'}
                        </div>
                        <div style={ viewStatus === 'WAITING' ?  activeElementColor : null } onClick={e => {
                            setViewStatus('WAITING')
                            setSearchedPatients(patients.filter(patient => !patient?.survey?.isDone))
                        }}>
                            {'Waiting'}
                        </div>
                    </div>
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    searchedPatients.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                            {searchedPatients.map((patient, index) => <PatientCard 
                                patient={patient} 
                                setReload={setReload} 
                                reload={reload}
                                setIsShowUpdatePatient={setIsShowUpdateSurveyModal}
                                setIsShowAddPatient={setIsShowAddPatientForm}
                                setIsUpdatePatient={setIsUpdatePatient}
                                setIsShowDeletePatient={setIsShowDeletePatientModal}
                                setTargetPatient={setTargetPatient}
                                />
                            )}
                    </div>
                    :
                    <EmptySection setIsShowForm={setShowPatientDataForm} />
    }
            </div>
        </div>
    </div>
}

export default PatientsPage