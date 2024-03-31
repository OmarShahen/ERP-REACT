import { useEffect, useState } from 'react'
import NavigationBar from '../navigation/navigation-bar'
import PageHeader from '../sections/page-header'
import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { formatNumber } from '../../utils/numbers'
import { serverRequest } from '../API/request'
import translations from '../../i18n'

const ExpertProfileLayout = ({ roles }) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const pagePath = window.location.pathname
    const expertId = pagePath.split('/')[2]

    const [isLoading, setIsLoading] = useState(true)
    const [expert, setExpert] = useState()

    useEffect(() => {
        scroll(0, 0)
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/users/${expertId}`)
        .then(response => {
            setIsLoading(false)
            setExpert(response.data.user)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [])


    return <div className="page-container">
        <div className="show-mobile">
        </div>
            <div className="padded-container">
                <PageHeader 
                pageName={!isLoading ? expert.firstName : 'Loading...'} 
                isHideRefresh={true} 
                />
                <div className="mini-page-navigator-container">
                    <ul>
                        <li><NavLink to={`/experts/${expertId}/appointments`}>Appointments</NavLink></li>
                        <li><NavLink to={`/experts/${expertId}/payments`}>Payments</NavLink></li>
                        <li><NavLink to={`/experts/${expertId}/services`}>Services</NavLink></li> 
                        <li><NavLink to={`/experts/${expertId}/schedule`}>Schedule</NavLink></li> 
                    </ul>
                </div>
                <Outlet />
            </div>
        </div>
}

export default ExpertProfileLayout