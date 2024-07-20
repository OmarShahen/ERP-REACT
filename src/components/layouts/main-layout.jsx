import { useState, useEffect } from 'react'
import { Outlet, useSearchParams } from "react-router-dom"
import SideBar from "../navigation/sidebar"
import './layout.css'
import { useDispatch, useSelector } from 'react-redux'
import FooterSection from '../sections/footers/footer'
import { setIsShowSidebar } from '../../redux/slices/sidebarSlice'
import SuccessfulSignupModal from '../modals/successful-signup'
import NavigationBar from '../navigation/navigation-bar'


const MainLayout = () => {

    const dispatch = useDispatch()
    const sidebar = useSelector(state => state.sidebar)
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [searchParams, setSearchParams] = useSearchParams()
    const isUpgraded = searchParams.get('upgrade')

    const [isShowCelebration, setIsShowCelebration] = useState(user?.lastLoginDate  || isUpgraded || lang === 'ar' ? false : true)

    const [hideSideBar, setHideSideBar] = useState(false)

    const noSidebarStyle = { padding: window.innerWidth < 700 ? '0 .7rem' : '0 1rem' }

    useEffect(() => {

        const windowWidth = window.innerWidth


        if(windowWidth <= 950) {
            dispatch(setIsShowSidebar(false))
        }

        if(windowWidth <= 900) {
            setHideSideBar(true)
        }
        
      }, [])

    return <div className="main-layout-container">
        {
            isShowCelebration ?
            <SuccessfulSignupModal setIsShowModal={setIsShowCelebration} />
            :
            null
        }
             { 
             sidebar.isShowSidebar ? 
             <SideBar 
             isHideText={false} 
             setHideSideBar={setHideSideBar}
             />
             : 
             null 
             }
            <div className="page-main-container" style={sidebar.isShowSidebar ? { marginRight: '11vw', paddingLeft: '1rem' } : noSidebarStyle}>
                <NavigationBar />
                <Outlet />
                <FooterSection />
            </div>
    </div>
}

export default MainLayout