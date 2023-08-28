import { useState, useEffect } from 'react'
import './prescriptions.css'
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import PageHeader from '../components/sections/page-header'
import NavigationBar from '../components/navigation/navigation-bar';
import CircularLoading from '../components/loadings/circular';
import FloatingButton from '../components/buttons/floating-button'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { searchAppointments } from '../utils/searches/search-appointments'
import { format } from 'date-fns'
import ServiceCard from '../components/cards/service'
import { useNavigate } from 'react-router-dom'
import CartBanner from '../components/banners/cart'
import { isRolesValid } from '../utils/roles'
import translations from '../i18n'

const ServicesPage = ({ roles }) => {

    const navigate = useNavigate()

    const [isShowForm, setIsShowForm] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [showModalForm, setShowModalForm] = useState(false)
    const [services, setServices] = useState([])
    const [searchedServices, setSearchedServices] = useState([])

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)
    const invoice = useSelector(state => state.invoice)

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
        if(!invoice.isActive) {
            navigate('/invoices')
        }
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/services/clinics/${user.clinicId}`)
        .then(response => {
            setIsLoading(false)
            setServices(response.data.services)
            setSearchedServices(response.data.services)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])


    return <div className="page-container">
        { invoice.isActive ? <CartBanner /> : null }
        <NavigationBar pageName={translations[lang]['Services']} />
        <div className="show-mobile">
            <FloatingButton setIsShowForm={setShowModalForm} />
        </div>
        <div className="padded-container">
            <PageHeader 
            pageName={translations[lang]["Add Invoice Services"]} 
            /> 
            <div className="margin-top-1"></div>
            <div className="search-input-container">
                <SearchInput 
                rows={services} 
                setRows={setSearchedServices}
                searchRows={searchAppointments}
                isHideClinics={true}
                />
            </div>
           
            {
                isLoading ?
                <CircularLoading />
                :
                searchedServices.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                        {searchedServices.map(service => <ServiceCard 
                        service={service} 
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

export default ServicesPage