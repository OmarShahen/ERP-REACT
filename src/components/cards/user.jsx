import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CardTransition from '../transitions/card-transitions'
import { useSelector } from 'react-redux'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { formatNumber } from '../../utils/numbers'


const UserCard = ({ user, setTargetUser, setIsShowDeleteModal, setIsShowUpdateModal, reload, setReload, setIsUpdate }) => {


    const updateUserBlock = (isBlocked) => {
        toast.loading('تحديث', { duration: 1000, position: 'top-left' })
        serverRequest.patch(`/v1/employees/${user._id}/blocked`, { isBlocked })
        .then(response => {
            toast.success(response.data.message, { duration: 3000, position: 'top-left' })
            setReload(reload + 1)
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-left' })
        })
    }


    const cardActionsList = [
        {
            name: 'مسح الموظف',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetUser(user)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: 'تحديث الموظف',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetUser(user)
                setIsUpdate(true)
                setIsShowUpdateModal(true)
            }
        },
        {
            name: 'تحديث الحالة',
            icon: <VisibilityOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                updateUserBlock(!user.isBlocked)
            }
        },
        
    ]

    return <CardTransition>
        <div 
        className="patient-card-container body-text disable-hover"
        >
            <div className="patient-card-header left-direction">
                <div className="patient-image-info-container">
                    <strong>#{user.userId}</strong>
                </div>
                <CardActions actions={cardActionsList} />
            </div>
            <div className="patient-card-body right-direction">
                <ul>
                    <li>
                        <strong>الاسم</strong>
                        <span>{user.firstName}</span>
                    </li>
                    <li>
                        <strong>البريد</strong>
                        <span>{user.email}</span>
                    </li>
                    <li>
                        <strong>الحالة</strong>
                        {
                            user.isBlocked ?
                            <span className="status-btn declined bold-text">محظور</span>
                            :
                            <span className="status-btn done bold-text">نشط</span>
                        }
                    </li>
                        
                    {/*<li>
                        <strong>Last Login</strong>
                        <span>{user.lastLoginDate ? formatDistance(new Date(user.lastLoginDate), new Date(), { addSuffix: true }) : 'غير مسجل'}</span>
                    </li>*/}
                </ul>
            </div>
            <CardDate 
            creationDate={user.createdAt}  
            updateDate={user.updatedAt} 
            />
        </div>
    </CardTransition>
}

export default UserCard