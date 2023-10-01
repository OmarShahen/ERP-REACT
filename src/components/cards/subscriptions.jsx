import './patient.css'
import { getAge } from '../../utils/age-calculator'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { useNavigate } from 'react-router-dom'
import CardTransition from '../transitions/card-transitions'
import { capitalizeFirstLetter } from '../../utils/formatString'
import { useSelector } from 'react-redux'
import translations from '../../i18n'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import { format, formatDistance  } from 'date-fns'
import { formatMoney } from '../../utils/numbers'

const SubscriptionCard = ({ subscription, reload, setReload, setTargetSubscription, setIsShowUpdatePatient }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const clinicName = subscription?.clinic?.name
    const clinicPhone = `+${subscription?.clinic?.countryCode}${subscription?.clinic?.phone}`

    const cardActionsList = []

    const getDaysDifference = (date1, date2) => {

        const timeDifference = Math.abs(date2.getTime() - date1.getTime())
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24))

        return daysDifference
    }

    return <CardTransition>
        <div 
        className="patient-card-container body-text">
            <div className="patient-card-header">
                <div className="patient-image-info-container">
                    <img src={`https://avatars.dicebear.com/api/initials/${clinicName}.svg`} alt="clinic-image" />
                    <div>
                        <strong>{clinicName}</strong>
                        <span className="grey-text">#{subscription?.clinicSubscriptionId}</span>
                    </div>
                </div>
                <CardActions actions={cardActionsList} />
            </div>
            <div className="patient-card-body">
                <ul>
                    <li>
                        <strong>Clinic</strong>
                        <span>{clinicName}</span>
                    </li>
                    <li>
                        <strong>{translations[lang]['Phone']}</strong>
                        <span>{clinicPhone}</span>
                    </li>
                    <li>
                        <strong>Paid</strong>
                        <span>{formatMoney(subscription.paid)}</span>
                    </li>
                    <li>
                        <strong>Start Date</strong>
                        <span>{format(new Date(subscription.startDate), 'dd MMM yyyy')}</span>
                    </li>
                    <li>
                        <strong>End Date</strong>
                        <span>{format(new Date(subscription.endDate), 'dd MMM yyyy')}</span>
                    </li>
                    <li>
                        <strong>Duration</strong>
                        <span>{getDaysDifference(new Date(subscription.startDate), new Date(subscription.endDate))} Days</span>
                    </li>
                    <li>
                        <strong>Status</strong>
                        {
                            new Date(subscription.endDate) > new Date() ?
                            subscription?.isActive ?
                            <span className="status-btn done bold-text">Active</span>
                            :
                            <span className="status-btn declined bold-text">Deactivated</span>
                            :
                            <span className="status-btn grey-bg bold-text">Expired</span>
                        }
                    </li>
                </ul>
            </div>
            <CardDate creationDate={subscription.createdAt}  updateDate={subscription.updatedAt} />
        </div>
    </CardTransition>
}

export default SubscriptionCard