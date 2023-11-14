import { useState, useEffect } from 'react'
import '../../prescriptions.css'
import { serverRequest } from "../../../components/API/request"
import CircularLoading from '../../../components/loadings/circular'
import FloatingButton from '../../../components/buttons/floating-button'
import EmptySection from '../../../components/sections/empty/empty'
import SearchInput from '../../../components/inputs/search'
import { searchStages } from '../../../utils/searches/search-stages'
import { toast } from 'react-hot-toast'
import FiltersSection from '../../../components/sections/filters/filters'
import PageHeader from '../../../components/sections/page-header'
import StageCard from '../../../components/cards/crm/stages'
import StageDeleteConfirmationModal from '../../../components/modals/confirmation/crm/stage-delete-confirmation-modal'
import StageFormModal from '../../../components/modals/stage-form'


const LeadStagesPage = ({ roles }) => {

    const pagePath = window.location.pathname
    const leadId = pagePath.split('/')[3]

    const [isShowDeleteStageModal, setIsShowDeleteStageModal] = useState(false)
    const [isShowAddStageForm, setIsShowAddStageForm] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [targetStage, setTargetStage] = useState({})

    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [stages, setStages] = useState([])
    const [searchedStages, setSearchedStages] = useState([])

    const [statsQuery, setStatsQuery] = useState({})


    useEffect(() => {
        setIsLoading(true)  
        serverRequest.get(`/v1/crm/stages/leads/${leadId}`,  { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setStages(response.data.stages)
            setSearchedStages(response.data.stages)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery])


    return <div className="page-container page-white-background">
        {
            isShowAddStageForm ?
            <StageFormModal 
            reload={reload} 
            setReload={setReload} 
            setShowFormModal={setIsShowAddStageForm}  
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            stage={targetStage}
            setStage={setTargetStage}
            />
            :
            null
        }
        {
            isShowDeleteStageModal ?
            <StageDeleteConfirmationModal
            reload={reload}
            setReload={setReload}
            stage={targetStage}
            setIsShowModal={setIsShowDeleteStageModal}
            />
            :
            null
        }

        <div className="show-mobile">
            <FloatingButton setIsShowForm={setIsShowAddStageForm} />
        </div>

        <div className="padded-container">
                            
                    <FiltersSection 
                    setStatsQuery={setStatsQuery} 
                    statsQuery={statsQuery}
                    defaultValue={'LIFETIME'}
                    />
                    <div className="search-input-container">
                        <SearchInput 
                        rows={stages} 
                        setRows={setSearchedStages}
                        searchRows={searchStages}
                        isHideClinics={true}
                        isShowStatus={false}
                        isShowStages={true}
                        />
                    </div>
                    
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    searchedStages.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                            {searchedStages.map((stage, index) => <StageCard 
                                stage={stage} 
                                setReload={setReload} 
                                reload={reload}
                                setIsUpdate={setIsUpdate}
                                setIsShowUpdateModal={setIsShowAddStageForm}
                                setIsShowDeleteModal={setIsShowDeleteStageModal}
                                setTargetStage={setTargetStage}
                                />
                            )}
                    </div>
                    :
                    <EmptySection />
                }
            </div>
        </div>
}

export default LeadStagesPage