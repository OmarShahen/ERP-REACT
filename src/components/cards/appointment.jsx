import { format } from 'date-fns'
import { getTime } from '../../utils/time'
import CardDate from './components/date'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import UpcomingOutlinedIcon from '@mui/icons-material/UpcomingOutlined'
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CardActions from './components/actions'
import { formatMoney } from '../../utils/numbers'
import CardTransition from '../transitions/card-transitions'
import { useSelector } from 'react-redux'
import translations from '../../i18n'
import CardImage from './components/image'

const AppointmentCard = ({ 
    appointment, 
    setIsShowDeleteModal, 
    setTargetAppointment, 
    setIsShowStatusModal,
    setStatus
}) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const cardActionsList = []

    user.roles.includes('STAFF') ?
    cardActionsList.push({
        name: translations[lang]['Delete'],
        icon: <DeleteOutlineOutlinedIcon />,
        onAction: (e) => {
            e.stopPropagation()
            setTargetAppointment(appointment)
            setIsShowDeleteModal(true)
        }
    })
    :
    null

    return <CardTransition>
    <div className="patient-card-container disable-hover body-text">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <CardImage name={appointment?.seeker?.firstName} />
                <div>
                    <strong>{appointment?.seeker?.firstName}</strong>
                    <span 
                    className="grey-text"
                    >
                        #{appointment?.seeker?.userId}
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
                        <span className="status-btn done">Paid</span>
                        :
                        <span className="status-btn pending">Pending</span>
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
                    <strong>Status</strong>
                    {
                        appointment.status === 'CANCELLED' ?
                        <span className="status-btn declined">Cancelled</span>
                        :
                        new Date(appointment.startTime) > new Date() ?
                        <span className="status-btn pending">Upcoming</span>
                        :
                        <span className="status-btn grey-bg">Expired</span>
                    }
                </li>
            </ul>
        </div>
        <CardDate creationDate={appointment?.createdAt} updateDate={appointment?.updatedAt} />
    </div>
    </CardTransition>
}

export default AppointmentCard