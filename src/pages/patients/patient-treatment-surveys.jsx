import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { serverRequest } from "../../components/API/request"
import { useSelector } from 'react-redux'
import PatientFormModal from '../../components/modals/patient-form'
import PatientCardJoinFormModal from '../../components/modals/patient-card-join-form';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CircularLoading from '../../components/loadings/circular'
import PatientCard from '../../components/cards/patient'
import CachedIcon from '@mui/icons-material/Cached'
import FloatingButton from '../../components/buttons/floating-button'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchTreatmentsSurveys } from '../../utils/searches/search-treatments-surveys'
import { useNavigate } from 'react-router-dom'
import TreatmentSurveyDeleteConfirmationModal from '../../components/modals/confirmation/treatment-survey-delete-confirmation-modal'
import { toast } from 'react-hot-toast'
import { isRolesValid } from '../../utils/roles'
import FiltersSection from '../../components/sections/filters/filters'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import Card from '../../components/cards/card'
import { formatNumber } from '../../utils/numbers'
import PageHeader from '../../components/sections/page-header'
import PatientSurveyCard from '../../components/cards/patient-survey'
import TreatmentSurveyCard from '../../components/cards/treatment-survey'

const PatientTreatmentSurveysPage = ({ roles }) => {

    const user = useSelector(state => state.user.user)

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]
    const clinicId = pagePath.split('/')[4]

    const [isShowDeleteSurveyModal, setIsShowDeleteSurveyModal] = useState(false)
    const [targetSurvey, setTargetSurvey] = useState({})

    const [statsQuery, setStatsQuery] = useState()
    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [treatmentsSurveys, setTreatmentsSurveys] = useState([])
    const [searchedTreatmentsSurveys, setSearchedTreatmentsSurveys] = useState([])

    useEffect(() => { 
        scroll(0,0)
    }, [])

    useEffect(() => {
        setIsLoading(true)    
        const endpointURL = `/v1/treatments-surveys/patients/${patientId}`  
        serverRequest.get(endpointURL,  { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setTreatmentsSurveys(response.data.treatmentsSurveys)
            setSearchedTreatmentsSurveys(response.data.treatmentsSurveys)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery])


    return <div className="page-container page-white-background">
        { 
            isShowDeleteSurveyModal ? 
            <TreatmentSurveyDeleteConfirmationModal 
            survey={targetSurvey}
            reload={reload}
            setReload={setReload} 
            setIsShowModal={setIsShowDeleteSurveyModal}
            /> 
            : 
            null 
        }

            <div className="padded-container">
                <PageHeader 
                pageName={'Treatments Surveys'}
                reload={reload}
                setReload={setReload}
                />
                <div className="cards-3-list-wrapper margin-bottom-1">
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Surveys'}
                    number={formatNumber(searchedTreatmentsSurveys.length)}
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
                        rows={treatmentsSurveys} 
                        setRows={setSearchedTreatmentsSurveys}
                        searchRows={searchTreatmentsSurveys}
                        isHideClinics={true}
                        />
                    </div>
                    
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    searchedTreatmentsSurveys.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                            {searchedTreatmentsSurveys.map((survey, index) => <TreatmentSurveyCard 
                                survey={survey} 
                                setReload={setReload} 
                                reload={reload}
                                setIsShowDeleteSurveyModal={setIsShowDeleteSurveyModal}
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

export default PatientTreatmentSurveysPage