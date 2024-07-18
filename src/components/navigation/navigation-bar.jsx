import { useState, useEffect } from 'react'
import './navigation-bar.css'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { setIsShowSidebar } from '../../redux/slices/sidebarSlice'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import QuickFormMenu from '../menus/quick-forms/quick-forms'
import ItemFormModal from '../modals/item-form'
import { serverRequest } from '../API/request'
import { setItems } from '../../redux/slices/itemSlice'


const NavigationBar = ({ pageName }) => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)
    const sidebar = useSelector(state => state.sidebar)
    const dispatch = useDispatch()

    const [showUserProfileMenu, setShowUserProfileMenu] = useState(false)
    const [showQuickActionsForm, setShowQuickActionsForm] = useState(false)


    const [isShowItemsForm, setIsShowItemsForm] = useState(false)


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


    return <div>
        <div className="navigation-bar-container body-text">
            <div className="navigation-map-container">
            <span>{`${user.firstName}`}</span>
                    <span onClick={e => dispatch(setIsShowSidebar(!sidebar.isShowSidebar))}>
                        <MenuOpenIcon />
                    </span>
            </div>
            
            <div className="navigation-bar-options-container">
                
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
                        setShowEmergencyContactForm={setIsShowEmergencyContactsForm}
                        setShowInsurancePoliciesForm={setIsShowInsurancePolicy}
                        setShowInvoiceForm={setShowInvoiceForm}
                        setShowMenu={setShowQuickActionsForm}
                        setIsShowInsuranceCompanyForm={setIsShowInsuranceCompanyForm}
                        setIsShowCommentForm={setIsShowCommentForm}
                        setIsShowLeadForm={setIsShowLeadForm}
                        setIsShowMeetingForm={setIsShowMeetingForm}
                        setIsShowStageForm={setIsShowStageForm}
                        setIsShowMessageTemplateForm={setIsShowMessageTemplateForm}
                        setIsShowValuesForm={setIsShowValuesForm}
                        setIsShowOpeningTime={setIsShowOpeningTime}
                        /> 
                        : 
                        null 
                    }
                </div>
                   
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
            isShowItemsForm ? 
            <ItemFormModal setShowModalForm={setIsShowItemsForm} />
             : 
             null 
        }
    </div>
}

export default NavigationBar