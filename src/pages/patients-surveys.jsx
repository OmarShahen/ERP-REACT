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
import { searchPatientsSurveys } from '../utils/searches/search-patients-surveys'
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
import PatientSurveyCard from '../components/cards/patient-survey'
import PatientSurveyDeleteConfirmationModal from '../components/modals/confirmation/patient-survey-delete-confirmation-modal'

const PatientsSurveysPage = ({ roles }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isShowUpdateSurveyModal, setIsShowUpdateSurveyModal] = useState(false)
    const [targetSurvey, setTargetSurvey] = useState({})

    const [statsQuery, setStatsQuery] = useState()
    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [showPatientIdForm, setShowPatientIdForm] = useState(false)
    const [showPatientDataForm, setShowPatientDataForm] = useState(false)
    const [patientsSurveys, setPatientsSurveys] = useState([])
    const [searchedPatientsSurveys, setSearchedPatientsSurveys] = useState([])

    useEffect(() => { 
        scroll(0,0)
    }, [])

    useEffect(() => {
        setIsLoading(true)    
        const endpointURL = `/v1/patients-surveys`  
        serverRequest.get(endpointURL,  { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setPatientsSurveys(response.data.patientsSurveys)
            setSearchedPatientsSurveys(response.data.patientsSurveys)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery])


    return <div className="page-container page-white-background">
        { 
        isShowUpdateSurveyModal ? 
        <PatientSurveyDeleteConfirmationModal 
        survey={targetSurvey}
        reload={reload}
        setReload={setReload} 
        setIsShowModal={setIsShowUpdateSurveyModal}
        /> 
        : 
        null 
        }

            <div className="padded-container">
                <PageHeader 
                pageName={'Impression Surveys'}
                reload={reload}
                setReload={setReload}
                totalNumber={patientsSurveys.length}
                />
                
                <div>
                    <FiltersSection 
                    setStatsQuery={setStatsQuery} 
                    statsQuery={statsQuery}
                    defaultValue={'LIFETIME'}
                    />
                    <div className="search-input-container">
                        <SearchInput 
                        rows={patientsSurveys} 
                        setRows={setSearchedPatientsSurveys}
                        searchRows={searchPatientsSurveys}
                        isHideClinics={false}
                        />
                    </div>
                    
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    searchedPatientsSurveys.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                            {searchedPatientsSurveys.map((survey, index) => <PatientSurveyCard 
                                survey={survey} 
                                setReload={setReload} 
                                reload={reload}
                                setIsShowUpdateSurvey={setIsShowUpdateSurveyModal}
                                setTargetSurvey={setTargetSurvey}
                                />
                            )}
                    </div>
                    :
                    <EmptySection />
    }
        </div>
        </div>
    </div>
}

export default PatientsSurveysPage