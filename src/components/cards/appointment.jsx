import { format } from 'date-fns'
import CardDate from './components/date'
import CardActions from './components/actions'
import CardTransition from '../transitions/card-transitions'
import CardImage from './components/image'
import { textShortener, capitalizeFirstLetter } from '../../utils/formatString'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'


const AppointmentCard = ({ 
    appointment, 
    setTargetAppointment, 
    setIsShowFormModal,
    setIsShowVerificationModal
}) => {

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
            name: 'Update Verification',
            icon: <VerifiedOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetAppointment(appointment)
                setIsShowVerificationModal(true)
            }
        }
    ]

    const renderVerificationStatus = (verification) => {

        if(verification == 'REVIEW') {
            return <span className="status-btn pending bold-text">{capitalizeFirstLetter(verification)}</span>
        } else if(verification == 'ACCEPTED') {
            return <span className="status-btn done bold-text">{capitalizeFirstLetter(verification)}</span>
        } else if(verification == 'REJECTED') {
            return <span className="status-btn declined bold-text">{capitalizeFirstLetter(verification)}</span>
        }

        return <span className="status-btn grey-bg bold-text">Not Registered</span>
    }

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
                    <strong>Verification</strong>
                    {renderVerificationStatus(appointment?.verification)}
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