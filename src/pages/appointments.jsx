import { useState, useEffect } from 'react'
import './prescriptions.css'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import PageHeader from '../components/sections/page-header'
import Card from '../components/cards/card';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import UpcomingOutlinedIcon from '@mui/icons-material/UpcomingOutlined'
import AppointmentFormModal from '../components/modals/appointment-form'
import TimerOffOutlinedIcon from '@mui/icons-material/TimerOffOutlined'
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined'
import NavigationBar from '../components/navigation/navigation-bar';
import CircularLoading from '../components/loadings/circular';
import FiltersSection from '../components/sections/filters/filters'
import FloatingButton from '../components/buttons/floating-button'
import AppointmentCard from '../components/cards/appointment'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { searchAppointments } from '../utils/searches/search-appointments'
import { format } from 'date-fns'
import { formatNumber } from '../utils/numbers'
import AppointmentDeleteConfirmationModal from '../components/modals/confirmation/appointment-delete-confirmation-modal'
import AppointmentStatusConfirmationModal from '../components/modals/confirmation/appointment-status-confirmation-modal'
import { isRolesValid } from '../utils/roles'
import { useNavigate, useSearchParams } from 'react-router-dom'
import translations from '../i18n'


const AppointmentsPage = ({ roles }) => {

    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()
    const periodType = searchParams.get('period')

    const [targetAppointment, setTargetAppointment] = useState({})
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowUpdateModal, setIsShowUpdateModal] = useState(false)
    const [status, setStatus] = useState()


    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [showModalForm, setShowModalForm] = useState(false)
    const [appointments, setAppointments] = useState([])
    const [searchedAppointments, setSearchedAppointments] = useState([])
    const [viewStatus, setViewStatus] = useState('ALL')

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const activeElementColor = { border: '2px solid #4c83ee', color: '#4c83ee' }

    let todayDate = new Date()
    periodType === '1' ? todayDate.setDate(todayDate.getDate() + 1) : null

    const [statsQuery, setStatsQuery] = useState({ specific: format(todayDate, 'yyyy-MM-dd') })

    useEffect(() => { 
        scroll(0,0) 
        //isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        setIsLoading(true)
        const endpointURL = `/v1/appointments/followup-service/clinics-subscriptions/active`

        serverRequest.get(endpointURL, { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setAppointments(response.data.appointments)
            setSearchedAppointments(response.data.appointments)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery])


    return <div className="page-container">
         { 
        isShowDeleteModal ? 
        <AppointmentDeleteConfirmationModal 
        appointment={targetAppointment}
        reload={reload}
        setReload={setReload} 
        setIsShowModal={setIsShowDeleteModal}
        setViewStatus={setViewStatus}
        /> 
        : 
        null 
        }
        { 
        isShowUpdateModal ? 
        <AppointmentStatusConfirmationModal 
        appointment={targetAppointment}
        reload={reload}
        setReload={setReload} 
        setIsShowModal={setIsShowUpdateModal}
        status={status}
        setViewStatus={setViewStatus}
        /> 
        : 
        null 
        }
        <div className="padded-container">
            <PageHeader 
            pageName={translations[lang]["Appointments"]} 
            setReload={setReload}
            reload={reload}
            /> 
            <div className="cards-list-wrapper">
                <Card 
                icon={<CalendarMonthOutlinedIcon />}
                cardHeader={translations[lang]['All']}
                number={formatNumber(appointments.length)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<UpcomingOutlinedIcon />}
                cardHeader={translations[lang]['Upcoming']}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'UPCOMING').length)}
                iconColor={'#FF8C00'}
                />
                <Card 
                icon={<HourglassEmptyOutlinedIcon />}
                cardHeader={translations[lang]['Waiting']}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'WAITING').length)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<MeetingRoomOutlinedIcon />}
                cardHeader={translations[lang]['Active']}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'ACTIVE').length)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<CheckCircleOutlineOutlinedIcon />}
                cardHeader={translations[lang]['Done']}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'DONE').length)}
                iconColor={'#00D4FF'}
                />
                <Card 
                icon={<CancelOutlinedIcon />}
                cardHeader={translations[lang]['Cancelled']}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'CANCELLED').length)}
                iconColor={'#FF579A'}
                />
                <Card 
                icon={<TimerOffOutlinedIcon />}
                cardHeader={translations[lang]['Expired']}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'EXPIRED').length)}
                iconColor={'#FF8C00'}
                />
            </div>
            <FiltersSection 
            statsQuery={statsQuery} 
            setStatsQuery={setStatsQuery} 
            isShowUpcomingDates={true}
            defaultValue={periodType === '1' ? '1' : '0'}
            />
            <div className="search-input-container">
                <SearchInput 
                rows={appointments} 
                setRows={setSearchedAppointments}
                searchRows={searchAppointments}
                isHideClinics={user.roles.includes('STAFF') ? true : false }
                />
            </div>
            <div className="appointments-categories-container">
                    <div style={ viewStatus === 'ALL' ? activeElementColor : null } onClick={e => {
                        setViewStatus('ALL')
                        setSearchedAppointments(appointments.filter(appointment => true))
                    }}>
                        {translations[lang]['All']}
                    </div>
                    <div style={ viewStatus === 'UPCOMING' ?  activeElementColor : null } onClick={e => {
                        setViewStatus('UPCOMING')
                        setSearchedAppointments(appointments.filter(appointment => appointment.status === 'UPCOMING'))
                    }}>
                        {translations[lang]['Upcoming']}
                    </div>
                    <div style={ viewStatus === 'WAITING' ?  activeElementColor : null } onClick={e => {
                        setViewStatus('WAITING')
                        setSearchedAppointments(appointments.filter(appointment => appointment.status === 'WAITING'))
                    }}>
                        {translations[lang]['Waiting']}
                    </div>
                    <div style={ viewStatus === 'ACTIVE' ? activeElementColor : null } onClick={e => {
                        setViewStatus('ACTIVE')
                        setSearchedAppointments(appointments.filter(appointment => appointment.status === 'ACTIVE'))
                    }}>
                        {translations[lang]['Active']}
                    </div>
                    <div style={ viewStatus === 'DONE' ? activeElementColor : null } onClick={e => {
                        setViewStatus('DONE')
                        setSearchedAppointments(appointments.filter(appointment => appointment.status === 'DONE'))
                    }}>
                        {translations[lang]['Done']}
                    </div>
                    <div style={ viewStatus === 'CANCELLED' ? activeElementColor : null } onClick={e => {
                        setViewStatus('CANCELLED')
                        setSearchedAppointments(appointments.filter(appointment => appointment.status === 'CANCELLED'))
                    }}>
                        {translations[lang]['Cancelled']}
                    </div>
                    <div style={ viewStatus === 'EXPIRED' ? activeElementColor : null } onClick={e => {
                        setViewStatus('EXPIRED')
                        setSearchedAppointments(appointments.filter(appointment => appointment.status === 'EXPIRED'))
                    }}>
                        {translations[lang]['Expired']}
                    </div>
                </div>
            {
                isLoading ?
                <CircularLoading />
                :
                searchedAppointments.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                        {searchedAppointments.map(appointment => <AppointmentCard 
                        appointment={appointment} 
                        reload={reload} 
                        setReload={setReload} 
                        setIsShowDeleteModal={setIsShowDeleteModal}
                        setIsShowStatusModal={setIsShowUpdateModal}
                        setTargetAppointment={setTargetAppointment}
                        setStatus={setStatus}
                        />)}                    
                </div>
                :
                <EmptySection setIsShowForm={setShowModalForm} />
            }
        </div>
        
    </div>
}

export default AppointmentsPage