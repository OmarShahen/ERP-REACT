import { useState, useEffect } from 'react'
import './navigation-bar.css'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { setIsShowSidebar } from '../../redux/slices/sidebarSlice'
import { serverRequest } from '../API/request'
import { setItems } from '../../redux/slices/itemSlice'
import ManageHistoryOutlinedIcon from '@mui/icons-material/ManageHistoryOutlined'
import ShiftFormModal from '../modals/shift-form'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import CachedIcon from '@mui/icons-material/Cached'
import WifiIcon from '@mui/icons-material/Wifi'


const NavigationBar = ({ pageName }) => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)
    const sidebar = useSelector(state => state.sidebar)
    const dispatch = useDispatch()

    const [showUserProfileMenu, setShowUserProfileMenu] = useState(false)

    const [isOnline, setIsOnline] = useState(navigator.onLine)

    const [isShowShiftModal, setIsShowShiftModal] = useState(false)
    const [isShiftActive, setIsShiftActive] = useState(false)

    const [isShiftLoading, setIsShiftLoading] = useState(true)
    const [activeShift, setActiveShift] = useState()
    const [shiftReload, setShiftReload] = useState(1)

    const [syncItems, setSyncItems] = useState(1)


    useEffect(() => {
        if(!user.isLogged) {
            navigate('/login')
        }

        const windowWidth = window.innerWidth

        if(windowWidth <= 600) {
            dispatch(setIsShowSidebar(false))
        }

    }, [user.isLogged])

    useEffect(() => {
        serverRequest.get('/v1/all/items')
        .then(response => {
            dispatch(setItems({ items: response.data.items }))
            if(syncItems !== 1) {
                toast.success('تم تحديث المنتجات بنجاح', { duration: 3000, position: 'top-left' })
            }
            
        })
        .catch(error => {
            console.error(error)
        })
    }, [syncItems])

    useEffect(() => {
        if(user.type === 'ADMIN') {
            return
        }
        setIsShiftLoading(true)
        serverRequest.get(`/v1/shifts/cashiers/${user._id}/active`)
        .then(response => {
            setIsShiftLoading(false)
            setIsShiftActive(response.data.isActive)
            setActiveShift(response.data.shift)
        })
        .catch(error => {
            setIsShiftLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [shiftReload])

    const updateOnlineStatus = () => {
        setIsOnline(navigator.onLine)
        if(!navigator.onLine) {
            toast.error('أنت غير متصل بالإنترنت', { duration: 3000, position:'top-left' })
        }
    }

    useEffect(() => {
        window.addEventListener('online', updateOnlineStatus)
        window.addEventListener('offline', updateOnlineStatus)
    
        return () => {
          window.removeEventListener('online', updateOnlineStatus)
          window.removeEventListener('offline', updateOnlineStatus)
        }
    }, [])

    return <div>
        <div className="navigation-bar-container body-text">
            <div className="navigation-map-container">
            <span>{`${user.firstName}`}</span>
                    <span onClick={e => dispatch(setIsShowSidebar(!sidebar.isShowSidebar))}>
                        <MenuOpenIcon />
                    </span>
            </div>
            
            <div className="navigation-bar-options-container">

               {
                user.type === 'ADMIN' ?
                null
                :
                <div>
                    {
                        isShiftLoading ?
                        <TailSpin width="17" height="17" color="#4c83ee" />
                        :
                        !isShiftActive ? 
                        <button onClick={() => setIsShowShiftModal(true)} className="normal-button action-color-bg white-text shift-button">
                            بدء الوردية
                            <ManageHistoryOutlinedIcon />
                        </button>
                        :
                        <button onClick={() => setIsShowShiftModal(true)} className="normal-button red-bg white-text shift-button">
                            اغلاق الوردية
                            <ManageHistoryOutlinedIcon />
                        </button>
                
                    }
                </div> 
                }
                
                   
                <div className="show-large">
                    <a onClick={e => {
                        e.preventDefault()
                        setSyncItems(syncItems + 1)
                    }}>
                        <CachedIcon />
                    </a>
                </div>
                <div className="show-large">
                    <WifiIcon  style={isOnline ? { color: '#2193B0' } : { color: '#DE350B' }} />
                </div>
                <div className="show-large">
                    <NotificationsNoneOutlinedIcon />
                </div>
                <div className="user-profile-container show-large">
                    <span onClick={e => setShowUserProfileMenu(!showUserProfileMenu)}>
                        <AccountCircleIcon />
                    </span>
                </div>
            </div>
        </div>
        {
            isShowShiftModal ?
            <ShiftFormModal 
            setShowModalForm={setIsShowShiftModal} 
            isDone={!isShiftActive} 
            activeShift={activeShift}
            reload={shiftReload}
            setReload={setShiftReload}
            />
            :
            null
        }
    </div>
}

export default NavigationBar