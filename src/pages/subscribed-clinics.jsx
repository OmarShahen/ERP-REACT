import { useState, useEffect } from 'react'
import './prescriptions.css'
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import CircularLoading from '../components/loadings/circular';
import FloatingButton from '../components/buttons/floating-button'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { searchClinics } from '../utils/searches/search-clinics'
import { format } from 'date-fns'
import { isRolesValid } from '../utils/roles'
import translations from '../i18n'
import ClinicCard from '../components/cards/clinic'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import Card from '../components/cards/card';
import { formatNumber } from '../utils/numbers';
import PageHeader from '../components/sections/page-header';


const SubscribedClinicsPage = ({ roles }) => {

    const [isShowForm, setIsShowForm] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [showModalForm, setShowModalForm] = useState(false)
    const [clinics, setClinics] = useState([])
    const [searchedClinics, setSearchedClinics] = useState([])

    const [viewStatus, setViewStatus] = useState('ALL')
    const activeElementColor = { border: '2px solid #4c83ee', color: '#4c83ee' }

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    useEffect(() => {
        scroll(0,0)
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/clinics/followup-service/clinics-subscriptions/all`)
        .then(response => {
            setIsLoading(false)
            setClinics(response.data.clinics)
            setSearchedClinics(response.data.clinics)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])


    return <div className="page-container">
        <PageHeader
        pageName="Subscribed Clinics"
        reload={reload}
        setReload={setReload} 
        isHideBackButton={true}
        />
        <div className="cards-3-list-wrapper margin-bottom-1 margin-top-1">
            <Card
            icon={<NumbersOutlinedIcon />}
            cardHeader={'Clinics'}
            number={formatNumber(searchedClinics.length)}
            iconColor={'#5C60F5'}
            />
        </div>
        <div className="padded-container">
            <div className="margin-top-1"></div>
            <div className="search-input-container">
                <SearchInput 
                rows={clinics} 
                setRows={setSearchedClinics}
                searchRows={searchClinics}
                isHideClinics={true}
                />
            </div>
           
            {
                isLoading ?
                <CircularLoading />
                :
                searchedClinics.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                        {searchedClinics.map(clinic => <ClinicCard 
                        clinic={clinic} 
                        reload={reload} 
                        setReload={setReload} 
                        />)}                    
                </div>
                :
                <EmptySection />
            }
        </div>
        
    </div>
}

export default SubscribedClinicsPage