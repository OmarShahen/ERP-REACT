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
import SubscriptionCard from '../components/cards/subscriptions'

const SubscriptionsPage = ({ roles }) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isShowUpdateSurveyModal, setIsShowUpdateSurveyModal] = useState(false)
    const [targetSubscription, setTargetSubscription] = useState({})

    const [statsQuery, setStatsQuery] = useState()
    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [subscriptions, setSubscriptions] = useState([])
    const [searchedSubscriptions, setSearchedSubscriptions] = useState([])

    const [viewStatus, setViewStatus] = useState('ALL')

    const activeElementColor = { border: '2px solid #4c83ee', color: '#4c83ee' }

    useEffect(() => { 
        scroll(0,0)
    }, [])

    useEffect(() => {
        setIsLoading(true)    
        const endpointURL = `/v1/clinics-subscriptions`  
        serverRequest.get(endpointURL,  { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setSubscriptions(response.data.clinicsSubscriptions)
            setSearchedSubscriptions(response.data.clinicsSubscriptions)
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
            { user.roles.includes('STAFF') || user.roles.includes('DOCTOR') ? <FloatingButton url={'/patients/form'} /> : null }
        </div>

            <div className="padded-container">
                <PageHeader 
                pageName={'Subscriptions'}
                reload={reload}
                setReload={setReload}
                />
                <div className="cards-4-list-wrapper margin-bottom-1">
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Subscriptions'}
                    number={formatNumber(searchedSubscriptions.length)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Active'}
                    number={formatNumber(searchedSubscriptions.filter(subscription => subscription.isActive && new Date(subscription.endDate) > new Date()).length)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Not Active'}
                    number={formatNumber(searchedSubscriptions.filter(subscription => !subscription.isActive && new Date(subscription.endDate) > new Date()).length)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Expired'}
                    number={formatNumber(searchedSubscriptions.filter(subscription => new Date(subscription.endDate) < new Date()).length)}
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
                        rows={subscriptions} 
                        setRows={setSearchedSubscriptions}
                        searchRows={searchPatients}
                        setTargetClinic={setTargetSubscription}
                        isHideClinics={false}
                        />
                    </div>
                    <div className="appointments-categories-container cards-list-wrapper">
                        <div style={ viewStatus === 'ALL' ? activeElementColor : null } onClick={e => {
                            setViewStatus('ALL')
                            setSearchedSubscriptions(subscriptions.filter(subscription => true))
                        }}>
                            {translations[lang]['All']}
                        </div>
                        <div style={ viewStatus === 'ACTIVE' ?  activeElementColor : null } onClick={e => {
                            setViewStatus('ACTIVE')
                            setSearchedSubscriptions(subscriptions.filter(subscription => subscription.isActive && new Date(subscription.endDate) > new Date()))
                        }}>
                            {'Active'}
                        </div>
                        <div style={ viewStatus === 'INACTIVE' ?  activeElementColor : null } onClick={e => {
                            setViewStatus('INACTIVE')
                            setSearchedSubscriptions(subscriptions.filter(subscription => !subscription.isActive && new Date(subscription.endDate) > new Date()))
                        }}>
                            {'Not Active'}
                        </div>
                        <div style={ viewStatus === 'EXPIRED' ?  activeElementColor : null } onClick={e => {
                            setViewStatus('EXPIRED')
                            setSearchedSubscriptions(subscriptions.filter(subscription => new Date(subscription.endDate) < new Date()))
                        }}>
                            {'Expired'}
                        </div>
                    </div>
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    searchedSubscriptions.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                            {searchedSubscriptions.map((subscription, index) => <SubscriptionCard 
                                subscription={subscription} 
                                setReload={setReload} 
                                reload={reload}
                                setTargetSubscription={setTargetSubscription}
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

export default SubscriptionsPage