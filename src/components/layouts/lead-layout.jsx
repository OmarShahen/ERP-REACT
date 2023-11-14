import { useState, useEffect } from 'react'
import { NavLink, Outlet } from "react-router-dom"
import { serverRequest } from '../../components/API/request'
import PageHeader from '../sections/page-header'


const LeadLayout = () => {

    const pagePath = window.location.pathname
    const leadId = pagePath.split('/')[3]

    const [isLoading, setIsLoading] = useState(true)
    const [lead, setLead] = useState({})


    useEffect(() => scroll(0,0), [])
    
    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/crm/leads/${leadId}`)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setLead(data.lead)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [])


    return <div className="page-container">
        <div className="padded-container">
            <PageHeader 
            pageName={isLoading ? 'Loading...' : lead?.name}
            />
            <div className="mini-page-navigator-container">
                <ul>
                    <li><NavLink to={`/crm/leads/${leadId}/stages`}>Stages</NavLink></li>
                    <li><NavLink to={`/crm/leads/${leadId}/meetings`}>Meetings</NavLink></li>
                </ul>
            </div>
            <Outlet />
        </div>
    </div>
}

export default LeadLayout