import { useEffect } from 'react'
import PageHeader from '../sections/page-header'
import { NavLink, Outlet } from 'react-router-dom'
import './layout.css'

const ExpertLayout = ({ roles }) => {

    useEffect(() => {
        scroll(0,0)
    }, [])


    return <div className="page-container">
        <div className="show-mobile">
        </div>
            <div className="padded-container">
                <PageHeader pageName={'Expert'} isHideRefresh={true} />
                <div className="mini-page-navigator-container">
                    <ul>
                        <li><NavLink to={`/experts`}>Profile</NavLink></li> 
                    </ul>
                </div>
                <Outlet />
            </div>
        </div>
}

export default ExpertLayout