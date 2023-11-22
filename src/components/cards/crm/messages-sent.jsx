import '../patient.css'
import CardDate from '../components/date'
import CardActions from '../components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardTransition from '../../transitions/card-transitions'
import { capitalizeFirstLetter, formatBooleanValue } from '../../../utils/formatString'
import { formatMoney } from '../../../utils/numbers'
import { useNavigate } from 'react-router-dom'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import { format, formatDistance } from 'date-fns'


const MessageSentCard = ({ 
    messageSent, 
    setTargetMessageSent,
    setIsUpdate,
    setIsShowUpdateModal,
    setIsShowDeleteModal,
}) => {

    const navigate = useNavigate()

    const cardActionsList = [
        {
            name: 'Delete Message',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetMessageSent(messageSent)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: 'Update Message',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setIsUpdate(true)
                setTargetMessageSent(messageSent)
                setIsShowUpdateModal(true)
            }
        },
     ]

    return <CardTransition>
        <div 
        className="patient-card-container body-text"
        onClick={e => {
            e.stopPropagation()
            setIsUpdate(true)
            setTargetMessageSent(messageSent)
            setIsShowUpdateModal(true)
        }}
        >
            <div className="patient-card-header">
                <div className="patient-image-info-container">
                    <img src={`https://avatars.dicebear.com/api/initials/${messageSent?.lead?.name}.svg`} alt="lead-image" />
                    <div>
                        <strong>{messageSent?.lead?.name}</strong>
                        <span className="grey-text">#{messageSent?.lead?.leadId}</span>
                    </div>
                </div>
                <CardActions actions={cardActionsList} />
            </div>
            <div className="patient-card-body">
                <ul>
                    <li>
                        <strong>Message</strong>
                        <span>{messageSent?.messageTemplate?.name ? capitalizeFirstLetter(messageSent?.messageTemplate?.name) : 'Not Registered'}</span>
                    </li>
                    <li>
                        <strong>Platform</strong>
                        <span>{capitalizeFirstLetter(messageSent?.platform)}</span>
                    </li>
                    <li>
                        <strong>Opened</strong>
                        <span>{formatBooleanValue(messageSent.isOpened)}</span>
                    </li>
                    <li>
                        <strong>Open Date</strong>
                        <span>
                            {
                                messageSent.openedDate ?
                                formatDistance(new Date(messageSent.openedDate), new Date(), { addSuffix: true })
                                :
                                'Not Registered'
                            }
                        </span>
                    </li>
                    <li>
                        <strong>Responded</strong>
                        <span>{formatBooleanValue(messageSent.isResponded)}</span>
                    </li>
                    <li>
                        <strong>Respond Date</strong>
                        <span>
                            {
                                messageSent.respondedDate ?
                                formatDistance(new Date(messageSent.respondedDate), new Date(), { addSuffix: true })
                                :
                                'Not Registered'
                            }
                        </span>
                    </li>
                    <li>
                        <strong>CTA</strong>
                        <span>{formatBooleanValue(messageSent.isCTADone)}</span>
                    </li>
                </ul>
            </div>
            <CardDate 
            creationDate={messageSent.createdAt} 
            updateDate={messageSent.updatedAt} 
            />
        </div>
    </CardTransition>
}

export default MessageSentCard