import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { serverRequest } from "../../components/API/request"
import CircularLoading from '../../components/loadings/circular'
import FloatingButton from '../../components/buttons/floating-button'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { toast } from 'react-hot-toast'
import FiltersSection from '../../components/sections/filters/filters'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import Card from '../../components/cards/card'
import { formatNumber, formatMoney } from '../../utils/numbers'
import PageHeader from '../../components/sections/page-header'
import LeadCard from '../../components/cards/crm/leads'
import LeadFormModal from '../../components/modals/lead-form'
import LeadDeleteConfirmationModal from '../../components/modals/confirmation/crm/lead-delete-confirmation-modal'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'


const LeadsPage = ({ roles }) => {

    const [isShowDeleteLeadModal, setIsShowDeleteLeadModal] = useState(false)
    const [isShowAddLeadForm, setIsShowAddLeadForm] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [targetLead, setTargetLead] = useState({})

    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [leads, setLeads] = useState([])
    const [totalLeads, setTotalLeads] = useState(0)
    const [totalOpened, setTotalOpened] = useState(0)
    const [totalClosed, setTotalClosed] = useState(0)
    const [totalWon, setTotalWon] = useState(0)
    const [totalLost, setTotalLost] = useState(0)
    const [potentialEarnings, setPotentialEarnings] = useState(0)
    const [searchedLeads, setSearchedLeads] = useState([])

    const [statsQuery, setStatsQuery] = useState({})

    useEffect(() => {
        setIsLoading(true)    
        const endpointURL = `/v1/crm/leads`  
        serverRequest.get(endpointURL,  { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setLeads(data.leads)
            setSearchedLeads(data.leads)
            setTotalLeads(data.totalLeads)
            setTotalOpened(data.totalOpened)
            setTotalClosed(data.totalClosed)
            setTotalWon(data.totalWon)
            setTotalLost(data.totalLost)
            setPotentialEarnings(data.potentialEarnings)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery])

    const searchLeads = (value) => {
        const endpointURL = `/v1/crm/leads/name/search?name=${value}`
        setIsLoading(true)
        serverRequest.get(endpointURL)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setLeads(data.leads)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }

    return <div className="page-container page-white-background">
        {
            isShowAddLeadForm ?
            <LeadFormModal 
            reload={reload} 
            setReload={setReload} 
            setShowModalForm={setIsShowAddLeadForm}  
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            lead={targetLead}

            />
            :
            null
        }
        {
            isShowDeleteLeadModal ?
            <LeadDeleteConfirmationModal
            reload={reload}
            setReload={setReload}
            lead={targetLead}
            setIsShowModal={setIsShowDeleteLeadModal}
            />
            :
            null
        }
        
        <div className="show-mobile">
            <FloatingButton setIsShowForm={setIsShowAddLeadForm} />
        </div>

            <div className="padded-container">
                <div>
                    <PageHeader 
                    pageName={'Leads'}
                    reload={reload}
                    setReload={setReload}
                    addBtnText={'Add Lead'}
                    setShowModalForm={setIsShowAddLeadForm}
                    totalNumber={totalLeads}
                    />
                    <div className="cards-3-list-wrapper margin-bottom-1">
                        <Card 
                        icon={<NumbersOutlinedIcon />}
                        cardHeader={'Leads'}
                        number={formatNumber(totalLeads)}
                        iconColor={'#5C60F5'}
                        />
                        <Card 
                        icon={<NumbersOutlinedIcon />}
                        cardHeader={'Opened'}
                        number={formatNumber(totalOpened)}
                        iconColor={'#5C60F5'}
                        />
                        <Card 
                        icon={<NumbersOutlinedIcon />}
                        cardHeader={'Closed'}
                        number={formatNumber(totalClosed)}
                        iconColor={'#5C60F5'}
                        />
                        <Card 
                        icon={<NumbersOutlinedIcon />}
                        cardHeader={'Won'}
                        number={formatNumber(totalWon)}
                        iconColor={'#5C60F5'}
                        />
                        <Card 
                        icon={<NumbersOutlinedIcon />}
                        cardHeader={'Lost'}
                        number={formatNumber(totalLost)}
                        iconColor={'#5C60F5'}
                        />
                        <Card 
                        icon={<PaidOutlinedIcon />}
                        cardHeader={'Potential Earnings'}
                        number={formatMoney(potentialEarnings)}
                        iconColor={'#5C60F5'}
                        isMoney={true}
                        />
                    </div>
                <div>
            </div>
                
                    <FiltersSection 
                    setStatsQuery={setStatsQuery} 
                    statsQuery={statsQuery}
                    defaultValue={'LIFETIME'}
                    />
                    <div className="search-input-container">
                        <SearchInput 
                        rows={leads} 
                        setRows={setLeads}
                        searchRows={searchLeads}
                        isSearchRemote={true}
                        isHideClinics={true}
                        isShowStatus={true}
                        isShowStages={true}
                        setIsLoading={setIsLoading}
                        />
                    </div>
                    
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    leads.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                            {leads.map((lead, index) => <LeadCard 
                                lead={lead} 
                                setReload={setReload} 
                                reload={reload}
                                setIsUpdate={setIsUpdate}
                                setIsShowUpdateLead={setIsShowAddLeadForm}
                                setIsShowDeleteLead={setIsShowDeleteLeadModal}
                                setTargetLead={setTargetLead}
                                />
                            )}
                    </div>
                    :
                    <EmptySection setIsShowForm={setIsShowAddLeadForm} />
    }
            </div>
        </div>
    </div>
}

export default LeadsPage