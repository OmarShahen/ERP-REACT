import '../patient.css'
import CardDate from '../components/date'
import CardActions from '../components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardTransition from '../../transitions/card-transitions'
import { capitalizeFirstLetter, textShortener } from '../../../utils/formatString'
import toast from 'react-hot-toast'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'


const MessageTemplateCard = ({ 
    message, 
    setTargetMessageTemplate, 
    setIsShowDeleteModal,
    setIsUpdate,
    setIsShowUpdateModal,
}) => {

    const cardActionsList = [
        {
            name: 'Delete Message',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetMessageTemplate(message)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: 'Update Message',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetMessageTemplate(message)
                setIsUpdate(true)
                setIsShowUpdateModal(true)
            }
        },
        {
            name: 'Copy',
            icon: <ContentCopyOutlinedIcon />,
            onAction: async e => {
                e.stopPropagation()
                await navigator.clipboard.writeText(message.description)
                toast.success('copied to clipboard successfully!', { duration: 3000, position: 'top-right' })
            }
        }
    ]

    return <CardTransition>
    <div 
    className="patient-card-container body-text"
    onClick={e => {
        e.stopPropagation()
        setTargetMessageTemplate(message)
        setIsUpdate(true)
        setIsShowUpdateModal(true)
    }}
    >
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <div>
                    <span className="grey-text bold-text">{message?.name}</span>
                    <br />
                    <span className="grey-text">#{message?.messageTemplateId}</span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        {
            message?.description ?
            <div className="patient-card-body body-text">
                {textShortener(message.description, 70)}
            </div>
            :
            null
        }
        <div className="cards-tags-container margin-top-1">
            <span className="status-btn pending bold-text">
                {message?.category ? capitalizeFirstLetter(message?.category?.value) : null}
            </span>
        </div>
        <CardDate 
        creationDate={message.createdAt}
        updateDate={message.updatedAt}
        />
    </div>
    </CardTransition>
}

export default MessageTemplateCard