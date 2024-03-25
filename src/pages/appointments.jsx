import { useState, useEffect } from 'react'
import './prescriptions.css'
import { serverRequest } from "../components/API/request"
import PageHeader from '../components/sections/page-header'
import CircularLoading from '../components/loadings/circular';
import FiltersSection from '../components/sections/filters/filters'
import AppointmentCard from '../components/cards/appointment'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { formatNumber } from '../utils/numbers'
import AppointmentDeleteConfirmationModal from '../components/modals/confirmation/appointment-delete-confirmation-modal'
import { isRolesValid } from '../utils/roles'
import MeetingLinkFormModal from '../components/modals/meeting-link-form'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import Card from '../components/cards/card'
import VerificationStatusFormModal from '../components/modals/verification-status-form'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import { toast } from 'react-hot-toast'


const AppointmentsPage = ({ roles }) => {

    const [targetAppointment, setTargetAppointment] = useState({})
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowVerificationModal, setIsShowVerificationModal] = useState(false)
    const [status, setStatus] = useState('PAID')
    const [viewStatus, setViewStatus] = useState('ALL')
    const [meetingLink, setMeetingLink] = useState()
    const [verification, setVerification] = useState()

    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [showModalForm, setShowModalForm] = useState(false)
    const [appointments, setAppointments] = useState([])

    const [totalAppointments, setTotalAppointments] = useState(0)
    const [totalAppointmentsNotPaid, setTotalAppointmentsNotPaid] = useState(0)
    const [totalAppointmentsPaid, setTotalAppointmentsPaid] = useState(0)
    const [totalAppointmentsWithoutLink, setTotalAppointmentsWithoutLink] = useState(0)
    const [totalPassedAppointments, setTotalPassedAppointments] = useState(0)
    const [totalTodayAppointments, setTotalTodayAppointments] = useState(0)
    const [totalUpcomingAppointments, setTotalUpcomingAppointments] = useState(0) 

    const [stats, setStats] = useState({})

    const [statsQuery, setStatsQuery] = useState({})

    const activeElementColor = { border: '2px solid #4c83ee', color: '#4c83ee' }

    useEffect(() => { 
        scroll(0, 0) 
        //isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        setIsLoading(true)
        const endpointURL = `/v1/appointments`
        serverRequest.get(endpointURL, { params: { ...statsQuery, status, meetingLink, verification } })
        .then(response => {
            setIsLoading(false)
            setAppointments(response.data.appointments)
            setTotalAppointments(response.data.totalAppointments)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery, status, meetingLink, verification])

    useEffect(() => {
        const endpointURL = `/v1/stats/appointments`
        serverRequest.get(endpointURL)
        .then(response => {
            setTotalAppointmentsNotPaid(response.data.totalAppointmentsNotPaid)
            setTotalAppointmentsPaid(response.data.totalAppointmentsPaid)
            setTotalAppointmentsWithoutLink(response.data.totalAppointmentsWithoutLink)
            setTotalPassedAppointments(response.data.totalPassedAppointments)
            setTotalTodayAppointments(response.data.totalTodayAppointments)
            setTotalUpcomingAppointments(response.data.totalUpcomingAppointments)
            setStats(response.data)
        })
        .catch(error => {
            console.error(error)
        })
    }, [reload])

    const searchAppointmentsByName = (name) => {
        if(!name) {
            setReload(reload + 1)
            return
        }

        setIsLoading(true)
        serverRequest.get(`/v1/appointments/search/name`, { params: { name } })
        .then(response => {
            setIsLoading(false)
            setAppointments(response.data.appointments)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }

    const sendAppointmentsReminders = () => {
        setIsLoading(true)
        serverRequest.post(`/v1/appointments/reminder/send`)
        .then(response => {
            setReload(reload + 1)
            const successMessage = `${response.data.message} (${response.data.total} record)`
            toast.success(successMessage, { duration: 3000, position: 'top-right' })            
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }


    return <div className="page-container">
        {
            showModalForm ?
            <MeetingLinkFormModal
            reload={reload}
            setReload={setReload}
            appointment={targetAppointment}
            setShowModalForm={setShowModalForm}
            />
            :
            null
        }
        {
            isShowVerificationModal ?
            <VerificationStatusFormModal
            reload={reload}
            setReload={setReload}
            appointment={targetAppointment}
            setShowModalForm={setIsShowVerificationModal}
            />
            :
            null
        }
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
        
        <div className="padded-container">
            <PageHeader 
            pageName={'Appointments'} 
            setReload={setReload}
            reload={reload}
            totalNumber={totalAppointments}
            addBtnText2={'Send Reminders'}
            addBtnText2Icon={<NotificationsActiveOutlinedIcon />}
            button2Action={sendAppointmentsReminders}
            /> 
            <div className="cards-4-list-wrapper">
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Upcoming'}
                number={formatNumber(totalUpcomingAppointments)}
                iconColor={'#FF579A'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Today'}
                number={formatNumber(totalTodayAppointments)}
                iconColor={'#FF579A'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Passed'}
                number={formatNumber(totalPassedAppointments)}
                iconColor={'#FF579A'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Paid'}
                number={formatNumber(totalAppointmentsPaid)}
                iconColor={'#FF579A'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Not Paid'}
                number={formatNumber(totalAppointmentsNotPaid)}
                iconColor={'#FF579A'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Without Link'}
                number={formatNumber(totalAppointmentsWithoutLink)}
                iconColor={'#FF579A'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Reminder Sent'}
                number={formatNumber(stats.totalAppointmentsReminderSent ? stats.totalAppointmentsReminderSent : 0)}
                iconColor={'#FF579A'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'No Reminder Sent'}
                number={formatNumber(stats.totalAppointmentsReminderNotSent ? stats.totalAppointmentsReminderNotSent : 0)}
                iconColor={'#FF579A'}
                />
            </div>
            <br />
            <FiltersSection 
            statsQuery={statsQuery} 
            setStatsQuery={setStatsQuery} 
            isShowUpcomingDates={true}
            defaultValue={'LIFETIME'}
            />
            <div className="search-input-container">
                <SearchInput 
                searchRows={searchAppointmentsByName}
                isSearchRemote={true}
                isHideClinics={true}
                isShowStatus={true}
                isShowStages={true}
                />
            </div>
            <div className="appointments-categories-container margin-top-1">
                <div style={ viewStatus === 'ALL' ?  activeElementColor : null } onClick={e => {
                    setStatus()
                    setMeetingLink()
                    setVerification()
                    setViewStatus('ALL')
                }}>
                    All
                </div>
                <div style={ viewStatus === 'PAID' ?  activeElementColor : null } onClick={e => {
                    setStatus('PAID')
                    setViewStatus('PAID')
                    setVerification()
                    setMeetingLink()
                }}>
                    Paid
                </div>
                <div style={ viewStatus === 'UNPAID' ?  activeElementColor : null } onClick={e => {
                    setStatus('UNPAID')
                    setViewStatus('UNPAID')
                    setVerification()
                    setMeetingLink()
                }}>
                    Not Paid
                </div>
                <div style={ viewStatus === 'NO-LINK' ?  activeElementColor : null } onClick={e => {
                    setStatus('PAID')
                    setMeetingLink('FALSE')
                    setViewStatus('NO-LINK')
                    setVerification()
                }}>
                    Without Link
                </div> 
                <div style={ viewStatus === 'WITH-LINK' ?  activeElementColor : null } onClick={e => {
                    setStatus('PAID')
                    setMeetingLink('TRUE')
                    setViewStatus('WITH-LINK')
                    setVerification()
                }}>
                    With Link
                </div>  
                <div style={ viewStatus === 'REVIEW' ?  activeElementColor : null } onClick={e => {
                    setStatus()
                    setMeetingLink()
                    setViewStatus('REVIEW')
                    setVerification('REVIEW')
                }}>
                    Review
                </div>  
                <div style={ viewStatus === 'ACCEPTED' ?  activeElementColor : null } onClick={e => {
                    setStatus()
                    setMeetingLink()
                    setViewStatus('ACCEPTED')
                    setVerification('ACCEPTED')
                }}>
                    Accepted
                </div>  
                <div style={ viewStatus === 'REJECTED' ?  activeElementColor : null } onClick={e => {
                    setStatus()
                    setMeetingLink()
                    setViewStatus('REJECTED')
                    setVerification('REJECTED')
                }}>
                    Rejected
                </div>  
            </div>
            {
                isLoading ?
                <CircularLoading />
                :
                appointments.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                        {appointments.map(appointment => <AppointmentCard 
                        appointment={appointment} 
                        reload={reload} 
                        setReload={setReload} 
                        setIsShowDeleteModal={setIsShowDeleteModal}
                        setTargetAppointment={setTargetAppointment}
                        setIsShowFormModal={setShowModalForm}
                        setIsShowVerificationModal={setIsShowVerificationModal}
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