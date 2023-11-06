import { NavLink } from "react-router-dom"
import './navigation-tabs.css'
import { useSelector } from "react-redux"

const NavigationTabs = () => {

    const user = useSelector(state => state.user.user)

    return <div>
        <div className="navigation-tabs-links body-text">
            <ul>
                <NavLink to="/patients">
                    <li>
                        Patients
                    </li>
                </NavLink>
                {
                    user.roles.includes('ADMIN') ?
                    <NavLink to="/appointments">
                        <li>
                            Appointments
                        </li>
                    </NavLink>
                    :
                    null
                }
                
                <NavLink to="/clinics/all">
                    <li>
                        Clinics
                    </li>
                </NavLink>
                    
                {
                    user.roles.includes('ADMIN') ?
                    <NavLink to="/users">
                        <li>
                            Users
                        </li>
                    </NavLink>
                    :
                    null
                }
                {
                    user.roles.includes('ADMIN') ?
                    <NavLink to="/subscriptions">
                        <li>
                            Subscriptions
                        </li>
                    </NavLink>
                    :
                    null
                }
                <NavLink to="/patients-surveys">
                    <li>
                        Patients Surveys
                    </li>
                </NavLink>
                <NavLink to="/treatments-surveys">
                    <li>
                        Treatments Surveys
                    </li>
                </NavLink>
                {
                    user.roles.includes('ADMIN') ?
                    <NavLink to="/arrival-methods">
                        <li>
                            Arrival Methods
                        </li>
                    </NavLink>
                    :
                    null
                }
                <NavLink to="/settings/profile">
                    <li>
                        Settings
                    </li>
                </NavLink>
            </ul>
        </div>
    </div>
}

export default NavigationTabs