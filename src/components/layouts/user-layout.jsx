import { useEffect } from 'react'
import PageHeader from '../sections/page-header'
import { NavLink, Outlet } from 'react-router-dom'

const UserLayout = ({ roles }) => {

    useEffect(() => {
        scroll(0,0)
    }, [])


    return <div className="page-container">
        <div className="show-mobile">
        </div>
            <div className="padded-container">
                <PageHeader 
                pageName={'Users'} 
                isHideRefresh={true} 
                />
                <div className="mini-page-navigator-container">
                    <ul>
                        <li><NavLink to={`/users/experts`}>Experts</NavLink></li> 
                        <li><NavLink to={`/clinics/subscribed`}>Seekers</NavLink></li>
                    </ul>
                </div>
                <Outlet />
            </div>
        </div>
}

export default UserLayout