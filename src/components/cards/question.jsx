import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardTransition from '../transitions/card-transitions'
import { useNavigate } from 'react-router-dom'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { capitalizeFirstLetter } from '../../utils/formatString'


const QuestionCard = ({ 
    question, 
    setTarget, 
    setIsUpdate,
    setIsShowDelete,
    setIsShowForm,
    reload,
    setReload
}) => {

    const cardActionsList = [
        {
            name: 'Delete Question',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(question)
                setIsShowDelete(true)
            }
        },
        {
            name: 'Update Question',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(question)
                setIsUpdate(true)
                setIsShowForm(true)
            }
        }
     ]

    return <CardTransition>
        <div 
        className="patient-card-container body-text">
            <div className="patient-card-header">
                <div className="patient-image-info-container">
                    <div>
                        <strong>{capitalizeFirstLetter(question.name)}</strong>
                    </div>
                </div>
                <CardActions actions={cardActionsList} />
            </div>
            <div className="patient-card-body">
                <div className="flex">
                    <span className="status-btn pending bold-text">{question?.speciality?.name}</span>
                </div>
            </div>
            <CardDate 
            creationDate={question.createdAt}  
            updateDate={question.updatedAt} 
            />
        </div>
    </CardTransition>
}

export default QuestionCard