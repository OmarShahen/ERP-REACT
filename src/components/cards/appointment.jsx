import { format } from 'date-fns'
import CardDate from './components/date'
import CardActions from './components/actions'
import CardTransition from '../transitions/card-transitions'
import CardImage from './components/image'
import { textShortener } from '../../utils/formatString'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import LinkIcon from '@mui/icons-material/Link'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { formatNumber } from '../../utils/numbers'

const AppointmentCard = ({ 
    appointment, 
    setTargetAppointment, 
    setIsShowFormModal,
    reload,
    setReload
}) => {

    const sendReminder = () => {
        toast.loading('Sending reminder...', { duration: 2000, position: 'top-right' })
        serverRequest.post(`/v1/appointments/${appointment._id}/reminder/send`)
        .then(response => {
            setReload(reload + 1)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    const sendMeetingLink = () => {
        toast.loading('Sending meeting link...', { duration: 2000, position: 'top-right' })
        serverRequest.post(`/v1/appointments/${appointment._id}/meeting-link/send`)
        .then(response => {
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    const copyMeetingLink = () => {
        if(!appointment.meetingLink) {
            return toast.error('No meeting link registered', { duration: 3000, position: 'top-right' })
        }

        navigator.clipboard.writeText(appointment.meetingLink)
        .then(() => toast.success('Copied to clipboard', { duration: 3000, position: 'top-right' }))
        .catch(error => {
            toast.error(error.message, { duration: 3000, position: 'top-right' })
        })
    }

    const cardActionsList = [
        {
            name: 'Add Meeting Link',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetAppointment(appointment)
                setIsShowFormModal(true)
            }
        },
        {
            name: 'Send Reminder',
            icon: <NotificationsActiveOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                sendReminder()
            }
        },
        {
            name: 'Send Meeting Link',
            icon: <LinkIcon />,
            onAction: (e) => {
                e.stopPropagation()
                sendMeetingLink()
            }
        },
        {
            name: 'Copy Meeting Link',
            icon: <ContentCopyIcon />,
            onAction: (e) => {
                e.stopPropagation()
                copyMeetingLink()
            }
        }
    ]

    return <CardTransition>
    <div className="patient-card-container disable-hover body-text">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <CardImage 
                name={appointment?.seeker?.firstName} 
                imageURL={appointment?.seeker?.profileImageURL}
                />
                <div>
                    <strong>{appointment?.seeker?.firstName}</strong>
                    <span 
                    className="grey-text"
                    >
                        +{appointment?.seeker?.countryCode}{appointment?.seeker?.phone} (#{appointment?.seeker?.userId})
                    </span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body">
        
            <ul>
                <li>
                    <strong>ID</strong>
                    <span>#{appointment.appointmentId}</span>
                </li>
                <li>
                    <strong>Expert</strong>
                    <span>{appointment?.expert?.firstName}</span>
                </li>
                <li>
                    <strong>Seeker</strong>
                    <span>{appointment?.seeker?.firstName}</span>
                </li>
                <li>
                    <strong>Payment</strong>
                    {
                        appointment.isPaid ?
                        <span className="status-btn done bold-text">Paid</span>
                        :
                        <span className="status-btn pending bold-text">Pending</span>
                    }
                </li>
                <li>
                    <strong>Date</strong>
                    <span>{format(new Date(appointment?.startTime), 'dd MMM yyyy')}</span>
                </li>
                <li>
                    <strong>Start Time</strong>
                    <span>{format(new Date(appointment?.startTime), 'hh:mm a')}</span>
                </li>
                <li>
                    <strong>Duration</strong>
                    <span>{appointment?.duration} minutes</span>
                </li>
                <li>
                    <strong>Notified</strong>
                    <span>{appointment.isReminderSent ? 'Yes' : 'No'}</span>
                </li>
                <li>
                    <strong>Price</strong>
                    <span>{formatNumber(appointment.price)} {appointment.currency}</span>
                </li>
                <li>
                    <strong>Commission</strong>
                    <span>{formatNumber(appointment.price * appointment.commission)} {appointment.currency}</span>
                </li>
                <li>
                    <strong>Link</strong>
                    <span>{appointment.meetingLink ? textShortener(appointment.meetingLink, 14) : 'Not Registered'}</span>
                </li>
                <li>
                    <strong>Status</strong>
                    {
                        appointment.status === 'CANCELLED' ?
                        <span className="status-btn declined bold-text">Cancelled</span>
                        :
                        new Date(appointment.startTime) > new Date() ?
                        <span className="status-btn pending bold-text">Upcoming</span>
                        :
                        <span className="status-btn grey-bg bold-text">Expired</span>
                    }
                </li>
            </ul>
        </div>
        <CardDate creationDate={appointment?.createdAt} updateDate={appointment?.updatedAt} />
    </div>
    </CardTransition>
}

export default AppointmentCard