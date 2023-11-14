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
import Calender from '../../components/calenders/calender'
import MeetingFormModal from '../../components/modals/meeting-form'


const MeetingsPage = ({ roles }) => {

    const [isShowAddMeetingForm, setIsShowAddMeetingForm] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [targetMeeting, setTargetMeeting] = useState({})

    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [meetings, setMeetings] = useState([])

    const [statsQuery, setStatsQuery] = useState({})


    useEffect(() => {
        setIsLoading(true)    
        const endpointURL = `/v1/crm/meetings`  
        serverRequest.get(endpointURL,  { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setMeetings(response.data.meetings)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery])


    return <div className="page-container page-white-background">
        {
            isShowAddMeetingForm || isUpdate ?
            <MeetingFormModal 
            reload={reload} 
            setReload={setReload} 
            setShowFormModal={setIsShowAddMeetingForm}  
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            meeting={targetMeeting}
            setMeeting={setTargetMeeting}
            />
            :
            null
        } 
        <div className="show-mobile">
            <FloatingButton setIsShowForm={setIsShowAddMeetingForm} />
        </div>

            <div className="padded-container">
                <div>
                    <PageHeader 
                    pageName={'Meetings'}
                    reload={reload}
                    setReload={setReload}
                    addBtnText={'Add Meeting'}
                    setShowModalForm={setIsShowAddMeetingForm}
                    />
                <div>
            </div>   
            <Calender 
            meetings={meetings}
            setIsUpdate={setIsUpdate}
            setShowModalForm={setIsShowAddMeetingForm}
            setTargetMeeting={setTargetMeeting} 
            />  
            </div>
        </div>
    </div>
}

export default MeetingsPage