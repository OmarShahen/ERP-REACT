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
import { textShortener } from '../../utils/formatString'


const SpecialtyCard = ({ 
    specialty, 
    setTarget, 
    setIsUpdate,
    setIsShowDelete,
    setIsShowForm,
    reload,
    setReload
}) => {

    const navigate = useNavigate()

    const updateShow = (isShow) => {
        serverRequest.patch(`/v1/specialities/${specialty._id}/show`, { isShow })
        .then(response => {
            setReload(reload + 1)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            console.error(error?.response?.data?.message)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    const cardActionsList = [
        {
            name: 'مسح الفئة',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(specialty)
                setIsShowDelete(true)
            }
        },
        {
            name: 'تحديث الفئة',
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
        //onClick={() => navigate(`/specialties/${specialty._id}`)}
        className="patient-card-container body-text">
            <div className="patient-card-header left-direction">
                <strong>{specialty.name}</strong>
                <CardActions actions={cardActionsList} />
            </div>
            <CardDate 
            creationDate={specialty.createdAt}  
            updateDate={specialty.updatedAt} 
            />
        </div>
    </CardTransition>
}

export default SpecialtyCard