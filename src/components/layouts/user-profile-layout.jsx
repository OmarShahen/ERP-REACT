import { NavLink, Outlet } from "react-router-dom"
import NavigationBar from '../../components/navigation/navigation-bar'
import PageHeader from '../../components/sections/page-header'
import { useSelector } from "react-redux"
import translations from "../../i18n"

const UserProfileLayoutPage = () => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    return <div className="page-container">
        <div className="padded-container">
            <PageHeader pageName={translations[lang]["Account Settings"]} />
            <div className="mini-page-navigator-container">
                <ul>
                    <li><NavLink to={`/settings/profile`}>{translations[lang]['Details']}</NavLink></li>
                    <li><NavLink to={`/settings/password`}>{translations[lang]['Passwords']}</NavLink></li>
                    { 
                        user.roles.includes('DOCTOR') ? 
                        <li><NavLink to={`/settings/speciality`}>{translations[lang]['Speciality']}</NavLink></li>
                        :
                        null
                    }
                    <li><NavLink to={`/settings/account-delete`}>{translations[lang]['Delete Account']}</NavLink></li>
                </ul>
            </div>
            <div className="margin-top-1"></div>
            <Outlet />
        </div>
    </div>
}

export default UserProfileLayoutPage