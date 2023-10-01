import { useEffect } from 'react'
import PageHeader from '../sections/page-header'
import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import translations from '../../i18n'

const ClinicsLayout = ({ roles }) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    useEffect(() => {
        scroll(0,0)
    }, [])


    return <div className="page-container">
        <div className="show-mobile">
        </div>
            <div className="padded-container">
                <PageHeader pageName={translations[lang]['Clinics']} isHideRefresh={true} />
                <div className="mini-page-navigator-container">
                    <ul>
                        <li><NavLink to={`/clinics/all`}>Clinics</NavLink></li> 
                        { user.roles.includes('ADMIN') ? <li><NavLink to={`/clinics/subscribed`}>Subscribed</NavLink></li> : null }
                    </ul>
                </div>
                <Outlet />
            </div>
        </div>
}

export default ClinicsLayout