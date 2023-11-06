import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { serverRequest } from "../../components/API/request"
import CircularLoading from '../../components/loadings/circular'
import FloatingButton from '../../components/buttons/floating-button'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchLeads } from '../../utils/searches/search-leads'
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
    const [searchedLeads, setSearchedLeads] = useState([])

    const [statsQuery, setStatsQuery] = useState({})

    const getTotalByValue = (leads) => {
        let total = 0
        for(let i=0;i<leads.length;i++) {
            total += leads[i].value
        }

        return total
    }

    useEffect(() => {
        setIsLoading(true)    
        const endpointURL = `/v1/crm/leads`  
        serverRequest.get(endpointURL,  { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setLeads(response.data.leads)
            setSearchedLeads(response.data.leads)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery])


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
                    />
                    <div className="cards-3-list-wrapper margin-bottom-1">
                        <Card 
                        icon={<NumbersOutlinedIcon />}
                        cardHeader={'Leads'}
                        number={formatNumber(searchedLeads.length)}
                        iconColor={'#5C60F5'}
                        />
                        <Card 
                        icon={<NumbersOutlinedIcon />}
                        cardHeader={'Opened'}
                        number={formatNumber(searchedLeads.filter(lead => lead.status === 'OPENED').length)}
                        iconColor={'#5C60F5'}
                        />
                        <Card 
                        icon={<NumbersOutlinedIcon />}
                        cardHeader={'Closed'}
                        number={formatNumber(searchedLeads.filter(lead => lead.status === 'CLOSED').length)}
                        iconColor={'#5C60F5'}
                        />
                        <Card 
                        icon={<NumbersOutlinedIcon />}
                        cardHeader={'Won'}
                        number={formatNumber(searchedLeads.filter(lead => lead.status === 'WON').length)}
                        iconColor={'#5C60F5'}
                        />
                        <Card 
                        icon={<NumbersOutlinedIcon />}
                        cardHeader={'Lost'}
                        number={formatNumber(searchedLeads.filter(lead => lead.status === 'LOST').length)}
                        iconColor={'#5C60F5'}
                        />
                        <Card 
                        icon={<PaidOutlinedIcon />}
                        cardHeader={'Potential Earnings'}
                        number={formatMoney(getTotalByValue(searchedLeads.filter(lead => lead.status === 'OPENED')))}
                        iconColor={'#5C60F5'}
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
                        setRows={setSearchedLeads}
                        searchRows={searchLeads}
                        isHideClinics={true}
                        isShowStatus={true}
                        isShowStages={true}
                        />
                    </div>
                    
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    searchedLeads.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                            {searchedLeads.map((lead, index) => <LeadCard 
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