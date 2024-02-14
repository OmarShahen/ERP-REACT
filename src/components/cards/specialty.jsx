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
        },
        {
            name: specialty.isShow ? 'Hide Specialty' : 'Show Specialty',
            icon: <RemoveRedEyeOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                updateShow(specialty.isShow ? false : true)
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
                <div className="flex">
                    {
                       specialty.isShow ?
                       <span className="status-btn done bold-text">Visible</span> 
                       :
                       <span className="status-btn declined bold-text">Hidden</span>
                    }
                    <span></span>
                </div>
            </div>
            <CardDate 
            creationDate={specialty.createdAt}  
            updateDate={specialty.updatedAt} 
            />
        </div>
    </CardTransition>
}

export default SpecialtyCard