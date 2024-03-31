import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardTransition from '../transitions/card-transitions'
import { capitalizeFirstLetter } from '../../utils/formatString'
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'


const OpeningTimeCard = ({ openingTime, setTarget, setIsShowForm, setIsShowDeleteModal, setIsUpdate, setReload, reload }) => {

    const updateOpeningTimeActivityStatus = () => {
        serverRequest.patch(`/v1/opening-times/${openingTime._id}/activity`, { isActive: !openingTime.isActive })
        .then(response => {
            setReload(reload + 1)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    const cardActionsList = [
        {
            name: 'Delete Opening Time',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(openingTime)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: 'Update Opening Time',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(openingTime)
                setIsUpdate(true)
                setIsShowForm(true)
            }
        },
        {
            name: 'Update Activity',
            icon: <ToggleOffOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                updateOpeningTimeActivityStatus()
            }
        },
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

    return <CardTransition>
    <div className="patient-card-container disable-hover body-text">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <div>
                    <strong>{capitalizeFirstLetter(openingTime.weekday)}</strong>
                    <span className="grey-text">#{openingTime.openingTimeId}</span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>Opening Time</strong>
                    <span>
                        {`${formatHour(openingTime?.openingTime?.hour)}:${formatTimeNumber(openingTime?.openingTime?.minute)} ${getTimePeriod(openingTime?.openingTime?.hour)}`}
                    </span>
                </li>
                <li>
                    <strong>Closing Time</strong>
                    <span>
                        {`${formatHour(openingTime?.closingTime?.hour)}:${formatTimeNumber(openingTime?.closingTime?.minute)} ${getTimePeriod(openingTime?.closingTime?.hour)}`}
                    </span>
                </li>
                <li>
                    <strong>Status</strong>
                    {
                        openingTime.isActive ?
                        <span className="status-btn done bold-text">Active</span>
                        :
                        <span className="status-btn declined bold-text">Inactive</span>
                    }
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