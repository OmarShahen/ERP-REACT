import { Outlet } from "react-router-dom"
import './layout.css'
import FooterSection from '../sections/footers/footer'
import NavigationBar from '../navigation/navigation-bar'


const MainLayout = () => {

    const noSidebarStyle = { padding: window.innerWidth < 700 ? '0 .7rem' : '0 7rem' }

    return <div className="main-layout-container">
        <NavigationBar />
        <div className="page-main-container" style={noSidebarStyle}>
            <Outlet />
            <FooterSection />
        </div>
    </div>
}

export default MainLayout