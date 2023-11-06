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

const DashboardPage = ({ roles }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [stats, setStats] = useState()
    const [statsQuery, setStatsQuery] = useState()
    const [reload, setReload] = useState(1)

    useEffect(() => { 
        scroll(0,0)
    }, [])

    useEffect(() => {
        const endpointURL = `/v1/analytics/followup-service/overview`  
        serverRequest.get(endpointURL,  { params: statsQuery })
        .then(response => {
            setStats(response.data)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery])


    return <div className="page-container page-white-background">

            <div className="padded-container">
                <PageHeader 
                pageName={'Dashboard'}
                reload={reload}
                setReload={setReload}
                />
                <FiltersSection 
                setStatsQuery={setStatsQuery} 
                statsQuery={statsQuery}
                defaultValue={'LIFETIME'}
                />
                <div className="cards-3-list-wrapper margin-top-1">
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Patients'}
                    number={formatNumber(stats?.totalPatients ? stats?.totalPatients : 0)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Total Surveys'}
                    number={formatNumber(stats?.totalSurveys ? stats?.totalSurveys : 0)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Waiting Surveys'}
                    number={formatNumber(stats?.totalWaitingSurveys ? stats?.totalWaitingSurveys : 0)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Impression Surveys'}
                    number={formatNumber(stats?.totalPatientsSurveys ? stats?.totalPatientsSurveys : 0)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Treatment Surveys'}
                    number={formatNumber(stats?.totalTreatmentsSurveys ? stats?.totalTreatmentsSurveys : 0)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Calls'}
                    number={formatNumber(stats?.totalCalls ? stats?.totalCalls : 0)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Minutes'}
                    number={formatNumber(stats?.totalCallsDuration ? stats?.totalCallsDuration : 0)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Average Call Duration (Minutes)'}
                    number={formatNumber(stats?.averageCallDuration ? stats?.averageCallDuration.toFixed(2) : 0)}
                    iconColor={'#5C60F5'}
                    />
                </div>
        </div>
    </div>
}

export default DashboardPage