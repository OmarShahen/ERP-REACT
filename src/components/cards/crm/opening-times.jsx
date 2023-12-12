import '../patient.css'
import CardDate from '../components/date'
import CardActions from '../components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardTransition from '../../transitions/card-transitions'
import { capitalizeFirstLetter } from '../../../utils/formatString'
import { useNavigate } from 'react-router-dom'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import CardImage from '../components/image'
import { WEEK_DAYS } from '../../../utils/time'


const OpeningTimeCard = ({ 
    openingTime,
    setOpeningTime,
    setIsUpdate,
    setIsShowUpdate,
    setIsShowDelete,
}) => {

    const navigate = useNavigate()

    const cardActionsList = [
        {
            name: 'Delete Opening Time',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setOpeningTime(openingTime)
                setIsShowDelete(true)
            }
        },
        {
            name: 'Update Opening Time',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setIsUpdate(true)
                setOpeningTime(openingTime)
                setIsShowUpdate(true)
            }
        },
        {
            name: 'View Lead',
            icon: <RemoveRedEyeOutlinedIcon />,
            onAction: e => {
                e.stopPropagation()
                navigate(`/crm/leads/${openingTime?.lead?._id}/schedules`)
            }
        }
    ]

    const formatHour = (hour) => {
        if(hour <= 12) {
            return hour
        }

        return hour - 12
    }

    const formatTimeNumber = (time) => {
        const strTime = String(time)
        if(strTime.length > 1) {
            return String(time)
        }

        return '0' + strTime
    }

    const getTimePeriod = (hour) => {
        return hour >= 12 ? 'PM' : 'AM'
    }

    const getOpeningTimeStatus = (openingTime) => {
        const todayDate = new Date()
        const openingDate = new Date()
        const closingDate = new Date()

        
        const todayDay = WEEK_DAYS[todayDate.getDay()]

        openingDate.setHours(openingTime.openingTime.hour)
        openingDate.setMinutes(openingTime.openingTime.minute)

        closingDate.setHours(openingTime.closingTime.hour)
        closingDate.setMinutes(openingTime.closingTime.minute)

        if(todayDay === openingTime.weekday && openingDate < todayDate && closingDate > todayDate) {
            return <span className="status-btn pending bold-text">Opened</span>
        }

        return <span className="status-btn bold-text grey-bg">Closed</span>

    }

    return <CardTransition>
        <div 
        onClick={e => {
            e.stopPropagation()
            setIsUpdate(true)
            setOpeningTime(openingTime)
            setIsShowUpdate(true)
        }}
        className="patient-card-container body-text">
            <div className="patient-card-header">
                <div className="patient-image-info-container">
                    <CardImage name={openingTime?.lead?.name} />
                    <div>
                        <strong>{openingTime?.lead?.name}</strong>
                        <span className="grey-text">#{openingTime?.lead?.leadId}</span>
                    </div>
                </div>
                <CardActions actions={cardActionsList} />
            </div>
            <div className="patient-card-body">
                <ul>
                    <li>
                        <strong>Name</strong>
                        <span>{openingTime?.lead?.name}</span>
                    </li>
                    <li>
                        <strong>Day</strong>
                        <span>{capitalizeFirstLetter(openingTime?.weekday)}</span>
                    </li>
                    <li>
                        <strong>Opening</strong>
                        <span>
                            {`${formatHour(openingTime?.openingTime?.hour)}:${formatTimeNumber(openingTime?.openingTime?.minute)} ${getTimePeriod(openingTime?.openingTime?.hour)}`}
                        </span>
                    </li>
                    <li>
                        <strong>Closing</strong>
                        <span>
                            {`${formatHour(openingTime?.closingTime?.hour)}:${formatTimeNumber(openingTime?.closingTime?.minute)} ${getTimePeriod(openingTime?.closingTime?.hour)}`}
                        </span>
                    </li>
                    <li>
                        <strong>County</strong>
                        <span>{openingTime?.lead?.county ? capitalizeFirstLetter(openingTime?.lead?.county) : 'Not registered'}</span>
                    </li>
                    <li>
                        <strong>Status</strong>
                        {getOpeningTimeStatus(openingTime)}
                    </li>
                </ul>
            </div>
            <CardDate 
            creationDate={openingTime.createdAt} 
            updateDate={openingTime.updatedAt} 
            />
        </div>
    </CardTransition>
}

export default OpeningTimeCard