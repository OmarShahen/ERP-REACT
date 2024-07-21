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


const NavigationBar = ({ pageName }) => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)
    const sidebar = useSelector(state => state.sidebar)
    const dispatch = useDispatch()

    const [showUserProfileMenu, setShowUserProfileMenu] = useState(false)

    const [isShowShiftModal, setIsShowShiftModal] = useState(false)
    const [isShiftActive, setIsShiftActive] = useState(false)

    const [isShiftLoading, setIsShiftLoading] = useState(true)
    const [activeShift, setActiveShift] = useState()
    const [shiftReload, setShiftReload] = useState(1)


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
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

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
=======
                
                <div className="quick-form-container">
                    <button 
                    className="upgrade-btn"
                    onClick={e => setShowQuickActionsForm(!showQuickActionsForm)}
                    >
                        اضافة
                        <AddOutlinedIcon />
                    </button>
                    { 
                        showQuickActionsForm ? 
                        <QuickFormMenu 
                        setIsShowItemsForm={setIsShowItemsForm}
                        setShowMenu={setShowQuickActionsForm}
                        setIsShowSpecialityForm={setIsShowSpecialityForm}
                        /> 
                        : 
                        null 
>>>>>>> 1e608cef0694a48c73bfb7027a3fd25515cfd86e
                    }
                    
                </div>
               } 
                
                   
                <div className="show-large">
                    <NavLink>
                        <SettingsOutlinedIcon />
                    </NavLink>
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
        { 
        isShowSpecialityForm ? 
            <SpecialtyFormModal setShowFormModal={setIsShowSpecialityForm} type={'MAIN'} />
            : 
            null 
        }
    </div>
}

export default NavigationBar