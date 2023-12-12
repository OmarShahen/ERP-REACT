import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { serverRequest } from "../../components/API/request"
import CircularLoading from '../../components/loadings/circular'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchTreatmentsSurveys } from '../../utils/searches/search-treatments-surveys'
import TreatmentSurveyDeleteConfirmationModal from '../../components/modals/confirmation/treatment-survey-delete-confirmation-modal'
import { toast } from 'react-hot-toast'
import FiltersSection from '../../components/sections/filters/filters'
import PageHeader from '../../components/sections/page-header'
import TreatmentSurveyCard from '../../components/cards/treatment-survey'

const TreatmentsSurveysPage = ({ roles }) => {

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
        const endpointURL = `/v1/treatments-surveys`  
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
                pageName={'Treatment Surveys'}
                reload={reload}
                setReload={setReload}
                totalNumber={treatmentsSurveys.length}
                />
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
                        isHideClinics={false}
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

export default TreatmentsSurveysPage