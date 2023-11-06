import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import './sidebar.css'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined'
import StoreMallDirectoryOutlinedIcon from '@mui/icons-material/StoreMallDirectoryOutlined'
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined'
import { useDispatch, useSelector } from 'react-redux'
import { setIsShowSidebar } from '../../redux/slices/sidebarSlice'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { setIsLogged, setMode } from '../../redux/slices/userSlice'
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined'
import { serverRequest } from '../API/request'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import { formatNumber } from '../../utils/numbers'
import { setNumberOfInvitations } from '../../redux/slices/invitationSlice'
import { toast } from 'react-hot-toast'
import { capitalizeFirstLetter } from '../../utils/formatString'
import UpgradeOutlinedIcon from '@mui/icons-material/UpgradeOutlined'
import { motion, AnimatePresence } from "framer-motion";
import logoImage from '../../assets/memories.png'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import format from 'date-fns/format'
import translations from '../../i18n'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined'
import ContactEmergencyOutlinedIcon from '@mui/icons-material/ContactEmergencyOutlined'
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined'
import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined'
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined'
import SyncProblemOutlinedIcon from '@mui/icons-material/SyncProblemOutlined'
import RuleOutlinedIcon from '@mui/icons-material/RuleOutlined'
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined'
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined'
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined'
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined'


const SideBar = ({ width, isHideText, setHideSideBar }) => {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)
    const numberOfInvitations = useSelector(state => state.invitation.numberOfInvitations)

    const [numberOfAppointments, setNumberOfAppointments] = useState(0)

    const [isShowTreatment, setIsShowTreatment] = useState(true)
    const [isShowAppointments, setIsShowAppointments] = useState(true)
    const [isShowInsurances, setIsShowInsurances] = useState(user.roles.includes('STAFF') ? true : false)
    const [isShowInvoices, setIsShowInvoices] = useState(false)
    const [isShowUsers, setIsShowUsers] = useState(user.roles.includes('STAFF') ? true : false)
    const [isShowCRM, setIsShowCRM] = useState(true)
    const [isShowClinics, setIsShowClinics] = useState(true)
    const [isShowInvitations, setIsShowInvitations] = useState(false)


    useEffect(() => {
        serverRequest.get(`/v1/clinics-requests/users/${user._id}/status/PENDING`)
        .then(response => {
            dispatch(setNumberOfInvitations(response.data.clinicsRequests.length))
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    useEffect(() => {

        if(!user.roles.includes('DOCTOR') && !user.roles.includes('STAFF')) {
            return
        }

        const todayDate = new Date()

        const statsQuery = { specific: format(todayDate, 'yyyy-MM-dd') }

        const endpointURL = user.roles.includes('DOCTOR') ? 
        `/v1/appointments/doctors/${user._id}/status/UPCOMING`
        :
        `/v1/appointments/clinics/${user.clinicId}/status/UPCOMING`

        serverRequest.get(endpointURL, { params: statsQuery })
        .then(response => {
            setNumberOfAppointments(response.data.appointments.length)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    return <div className="side-bar-container body-text" style={{ width }}>
        <AnimatePresence>
      <motion.div
        className="sidebar"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.3 }}
      >
        <div className="side-bar-arrow-container show-mobile">
            <span onClick={e => dispatch(setIsShowSidebar(false))}>
                <ArrowBackIcon />
            </span>
        </div>
        <div className="center side-bar-logo-container">
            <img src={logoImage} />
        </div>
        <ul>
        <ul className="nav-nested-list-container">
            
            {
                user.roles.includes('ADMIN') ?
                <li>
                    <div>
                        <NavLink to="/dashboard">
                            <SignalCellularAltOutlinedIcon />
                            Dashboard
                        </NavLink>
                    </div>
                </li>
                :
                null
            }
            
            <li>
                <div>
                    <NavLink to="/patients">
                        <HotelOutlinedIcon />
                        {translations[lang]['Patients']}
                    </NavLink>
                </div>
            </li>
            <li>
                <div>
                    <NavLink to="/arrival-methods">
                        <NavigationOutlinedIcon />
                        Arrival Methods
                    </NavLink>
                </div>
            </li>
            {
                user.roles.includes('ADMIN') ?
                <li>
                    <div>
                        <NavLink to="/users">
                        <PersonOutlineOutlinedIcon />
                        Users
                        </NavLink>
                    </div>
                </li>
                :
                null
            }
            
        </ul>
        {
                user?.roles?.includes('ADMIN') ?
                <li>
                    <div 
                    className="header-list-container"
                    onClick={e => setIsShowCRM(!isShowCRM)}
                    >
                        CRM
                        <span>
                            { isShowCRM ? <KeyboardArrowUpIcon /> : <ExpandMoreOutlinedIcon /> }
                        </span>
                    </div>
                    {
                        isShowCRM ?
                        <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="nested-links"
                        >
                            <ul className="nav-nested-list-container">
                                <li>
                                    <div>
                                        <NavLink to="/crm/leads">
                                            <PeopleAltOutlinedIcon />
                                            Leads
                                        </NavLink>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <NavLink to="/crm/meetings">
                                            <CalendarMonthOutlinedIcon />
                                            Meetings
                                        </NavLink>
                                    </div>
                                </li>
                            </ul>
                        </motion.ul>
                        :
                        null
                    }
                    
                </li>
                :
                null
            }
            {
                user?.roles?.includes('ADMIN') ?
                <li>
                    <div 
                    className="header-list-container"
                    onClick={e => setIsShowClinics(!isShowClinics)}
                    >
                        Clinics
                        <span>
                            { isShowClinics ? <KeyboardArrowUpIcon /> : <ExpandMoreOutlinedIcon /> }
                        </span>
                    </div>
                    {
                        isShowClinics ?
                        <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="nested-links"
                        >
                            <ul className="nav-nested-list-container">
                                <li>
                                    <div>
                                        <NavLink to="/clinics/all">
                                            <StoreMallDirectoryOutlinedIcon />
                                            Clinics
                                        </NavLink>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <NavLink to="/clinics/subscribed">
                                            <HowToRegOutlinedIcon />
                                            Subscribed
                                        </NavLink>
                                    </div>
                                </li>
                            </ul>
                        </motion.ul>
                        :
                        null
                    }
                    
                </li>
                :
                null
            }
             <li>
                    <div 
                    className="header-list-container" 
                    onClick={e => setIsShowTreatment(!isShowTreatment)}
                    >
                        Surveys
                        <span>
                            { isShowTreatment ? <KeyboardArrowUpIcon /> : <ExpandMoreOutlinedIcon /> }
                        </span>
                    </div>
                    {
                        isShowTreatment ?
                        <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="nested-links"
                        >
                        <ul className="nav-nested-list-container">
                            <li>
                                <div>
                                    <NavLink to="/patients-surveys">
                                        <AssignmentOutlinedIcon />
                                        Impression
                                    </NavLink>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <NavLink to="/treatments-surveys">
                                        <MedicationOutlinedIcon />
                                        Treatment
                                    </NavLink>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <NavLink to="/comments">
                                        <MapsUgcOutlinedIcon />
                                        Comments
                                    </NavLink>
                                </div>
                            </li>
                        </ul>
                        </motion.ul>
                        :
                        null
                    }
                </li>
            </ul>
    </motion.div>
    </AnimatePresence>
    </div>
}

export default SideBar