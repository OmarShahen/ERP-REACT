import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { useSelector } from 'react-redux'
import CardTransition from '../transitions/card-transitions'
import translations from '../../i18n'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined'
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined'
import { SignalWifiStatusbarNullTwoTone } from '@mui/icons-material'
import { capitalizeFirstLetter, formatPatientName } from '../../utils/formatString'

const CommentCard = ({ 
    comment, 
    setTargetComment, 
    setIsShowDeleteModal,
    setIsUpdate,
    setShowFormModal,
}) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const navigate = useNavigate()
    

    const cardActionsList = [
        {
            name: 'Delete Comment',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetComment(comment)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: 'Update Comment',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetComment(comment)
                setIsUpdate(true)
                setShowFormModal(true)
            }
        }
     ]

    return <CardTransition>
    <div className="patient-card-container body-text">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <div>
                    <span className="grey-text">{comment?.clinic?.name}</span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body">
            {comment.description}
        </div>
        <div className="cards-tags-container margin-top-1">
            {
                comment.type === 'ISSUE' ?
                <span className="status-btn declined">{capitalizeFirstLetter(comment.type)}</span> 
                :
                <span className="status-btn done">{capitalizeFirstLetter(comment.type)}</span>
            }
        </div>
        <CardDate 
        creationDate={comment.createdAt}
        updateDate={comment.updatedAt}
        />
    </div>
    </CardTransition>
}

export default CommentCard