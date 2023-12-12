import { useState, useEffect } from 'react'
import './navigation-bar.css'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import UserProfileMenu from '../menus/profile/profile'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { setIsShowSidebar } from '../../redux/slices/sidebarSlice'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import QuickFormMenu from '../menus/quick-forms/quick-forms'
import AppointmentFormModal from '../modals/appointment-form'
import InvoiceFormModal from '../modals/invoice-form'
import InsurancePolicyFormModal from '../modals/insurance-policy-form'
import InsuranceFormModal from '../modals/insurance-form'
import CommentFormModal from '../modals/comment-form'
import LeadFormModal from '../modals/lead-form'
import MeetingFormModal from '../modals/meeting-form'
import StageFormModal from '../modals/stage-form'
import MessageTemplateFormModal from '../modals/message-template-form'
import ValueFormModal from '../modals/value-form'
import { serverRequest } from '../API/request'
import { setValues } from '../../redux/slices/valueSlice'
import { setMessagesTemplates } from '../../redux/slices/messageTemplateSlice'
import { toast } from 'react-hot-toast'
import OpeningTimeFormModal from '../modals/opening-time-form'


const NavigationBar = ({ pageName }) => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)
    const sidebar = useSelector(state => state.sidebar)
    const dispatch = useDispatch()

    const [showUserProfileMenu, setShowUserProfileMenu] = useState(false)
    const [showQuickActionsForm, setShowQuickActionsForm] = useState(false)

    const [isShowAppointmentsForm, setIsShowAppointmentsForm] = useState(false)
    const [showInvoiceForm, setShowInvoiceForm] = useState(false)
    const [isShowEmergencyContactsForm, setIsShowEmergencyContactsForm] = useState(false)
    const [isShowInsurancePolicy, setIsShowInsurancePolicy] = useState(false)
    const [isShowInsuranceCompanyForm, setIsShowInsuranceCompanyForm] = useState(false)
    const [isShowCommentForm, setIsShowCommentForm] = useState(false)
    const [isShowLeadForm, setIsShowLeadForm] = useState(false)
    const [isShowMeetingForm, setIsShowMeetingForm] = useState(false)
    const [isShowStageForm, setIsShowStageForm] = useState(false)
    const [isShowMessageTemplateForm, setIsShowMessageTemplateForm] = useState(false)
    const [isShowValuesForm, setIsShowValuesForm] = useState(false)
    const [isShowOpeningTime, setIsShowOpeningTime] = useState(false)


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
        serverRequest.get(`/v1/values`)
        .then(response => {
            const values = response.data.values
            dispatch(setValues({ values }))
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/crm/messages-templates`)
        .then(response => {
            const messagesTemplates = response.data.messagesTemplates
            dispatch(setMessagesTemplates({ messagesTemplates }))
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [])

    return <div>
        <div className="navigation-bar-container body-text">
            <div className="navigation-map-container">
                    <span onClick={e => dispatch(setIsShowSidebar(!sidebar.isShowSidebar))}>
                        <MenuOpenIcon />
                    </span>
                <span>{`${user.firstName} ${user.lastName}`}</span>
            </div>
            
            <div className="navigation-bar-options-container">
                
                <div className="quick-form-container">
                    <button 
                    className="upgrade-btn"
                    onClick={e => setShowQuickActionsForm(!showQuickActionsForm)}
                    >
                        <AddOutlinedIcon />
                        Create
                    </button>
                    { 
                        showQuickActionsForm ? 
                        <QuickFormMenu 
                        setShowAppointmentForm={setIsShowAppointmentsForm}
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
                    <NavLink to="/settings/profile">
                        <SettingsOutlinedIcon />
                    </NavLink>
                </div>
                <div className="show-large">
                    <NotificationsNoneOutlinedIcon />
                </div>
                <div className="user-profile-container">
                    <span onClick={e => setShowUserProfileMenu(!showUserProfileMenu)}>
                        <AccountCircleIcon />
                    </span>
                    { showUserProfileMenu ? <UserProfileMenu user={user} /> : null }
                </div>
            </div>
        </div>
        { 
            isShowAppointmentsForm ? 
            <AppointmentFormModal setShowFormModal={setIsShowAppointmentsForm} />
             : 
             null 
        }
        { 
            showInvoiceForm ? 
            <InvoiceFormModal setShowModalForm={setShowInvoiceForm} /> 
            : 
            null 
        }
        {
            isShowInsurancePolicy ?
            <InsurancePolicyFormModal setShowFormModal={setIsShowInsurancePolicy} />
            :
            null
        }
        {
            isShowInsuranceCompanyForm ?
            <InsuranceFormModal setShowFormModal={setIsShowInsuranceCompanyForm} />
            :
            null
        }
        {
            isShowCommentForm ?
            <CommentFormModal setShowModalForm={setIsShowCommentForm} />
            :
            null
        }
        {
            isShowLeadForm ?
            <LeadFormModal setShowModalForm={setIsShowLeadForm} />
            :
            null
        }
        {
            isShowMeetingForm ?
            <MeetingFormModal setShowFormModal={setIsShowMeetingForm} />
            :
            null
        }
        {
            isShowStageForm ?
            <StageFormModal setShowFormModal={setIsShowStageForm} />
            :
            null
        }
        {
            isShowMessageTemplateForm ?
            <MessageTemplateFormModal setShowFormModal={setIsShowMessageTemplateForm} />
            :
            null
        }
        {
            isShowValuesForm ?
            <ValueFormModal setShowFormModal={setIsShowValuesForm} />
            :
            null
        }
        {
            isShowOpeningTime ?
            <OpeningTimeFormModal setShowFormModal={setIsShowOpeningTime} />
            :
            null
        }

    </div>
}

export default NavigationBar