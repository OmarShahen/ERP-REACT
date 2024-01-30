import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardTransition from '../transitions/card-transitions'
import { useNavigate } from 'react-router-dom'

const SpecialtyCard = ({ 
    specialty, 
    setTarget, 
    setIsUpdate,
    setIsShowDelete,
    setIsShowForm
}) => {

    const navigate = useNavigate()

    const cardActionsList = [
        {
            name: 'Delete Specialty',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(specialty)
                setIsShowDelete(true)
            }
        },
        {
            name: 'Update Specialty',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(specialty)
                setIsUpdate(true)
                setIsShowForm(true)
            }
        }
     ]

    return <CardTransition>
        <div 
        onClick={() => navigate(`/specialties/${specialty._id}`)}
        className="patient-card-container body-text">
            <div className="patient-card-header">
                <div className="patient-image-info-container">
                    <div>
                        <strong>{specialty.name}</strong>
                    </div>
                </div>
                <CardActions actions={cardActionsList} />
            </div>
            <div className="patient-card-body">
                
            </div>
            <CardDate 
            creationDate={specialty.createdAt}  
            updateDate={specialty.updatedAt} 
            />
        </div>
    </CardTransition>
}

export default SpecialtyCard