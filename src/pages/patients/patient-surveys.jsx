import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { serverRequest } from "../../components/API/request"
import { useSelector } from 'react-redux'
import CircularLoading from '../../components/loadings/circular'
import FloatingButton from '../../components/buttons/floating-button'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchPatientsSurveys } from '../../utils/searches/search-patients-surveys'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import FiltersSection from '../../components/sections/filters/filters'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import Card from '../../components/cards/card'
import { formatNumber } from '../../utils/numbers'
import PageHeader from '../../components/sections/page-header'
import PatientSurveyCard from '../../components/cards/patient-survey'
import PatientSurveyDeleteConfirmationModal from '../../components/modals/confirmation/patient-survey-delete-confirmation-modal'

const PatientSurveysPage = ({ roles }) => {

    const user = useSelector(state => state.user.user)

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]
    const clinicId = pagePath.split('/')[4]

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
        const endpointURL = `/v1/patients-surveys/patients/${patientId}`  
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
        <div className="show-mobile">
            <FloatingButton url={'/patients/form'} />
        </div>

            <div className="padded-container">
                <PageHeader 
                pageName={'Surveys'}
                reload={reload}
                setReload={setReload}
                isHideBackButton={true}
                addBtnText={'Add Survey'}
                formURL={`/clinics/${clinicId}/patients/${patientId}/patient-survey/form`}
                />
                <div className="cards-3-list-wrapper margin-bottom-1">
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Surveys'}
                    number={formatNumber(searchedPatientsSurveys.length)}
                    iconColor={'#5C60F5'}
                    />
                </div>
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

export default PatientSurveysPage