import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CardTransition from '../transitions/card-transitions'
import { format } from 'date-fns'
import { formatNumber } from '../../utils/numbers'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


const ShiftCard = ({ 
    shift, 
    setTarget, 
    setIsShowDeleteModal,
}) => {

    const user = useSelector(state => state.user.user)

    const navigate = useNavigate()

    const cardActionsList = [
        {
            name: 'مسح الوردية',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(shift)
                setIsShowDeleteModal(true)
            }
        }
    ]


    return <CardTransition>
    <div 
    className="patient-card-container body-text"
    onClick={() => navigate(`/shifts/${shift._id}`)}
    >
        <div className="patient-card-header left-direction">
            <div className="patient-image-info-container">
                <div>
                    <strong>#{shift.shiftId}</strong>
                </div>
            </div>
            {
                user.type === 'ADMIN' ?
                <CardActions actions={cardActionsList} />
                :
                null
            }
        </div>
        <div className="patient-card-body">
            <ul>
               <li>
                    <span>الموظف</span>
                    <span>{shift?.cashier?.firstName}</span>
               </li>
               <li>
                    <span>توقيت الفتح</span>
                    <span>{shift.startTime ? format(new Date(shift.startTime), 'hh:mm a yyyy/MM/dd') : 'غير مسجل'}</span>
               </li>
               <li>
                    <span>توقيت الاغلاق</span>
                    <span>{shift.endTime ? format(new Date(shift.endTime), 'hh:mm a yyyy/MM/dd') : 'غير مسجل'}</span>
               </li>
               <li>
                    <span>مبلغ الفتح</span>
                    <span>{formatNumber(shift.openingBalance)} EGP</span>
               </li>
               <li>
                    <span>مبلغ الاغلاق</span>
                    <span>{formatNumber(shift.closingBalance)} EGP</span>
               </li>
               <li>
                    <span>الحالة</span>
                    {
                        shift.isDone ?
                        <span className="status-btn done bold-text">مغلقة</span>
                        :
                        <span className="status-btn pending bold-text">مفتوحة</span>
                    }
               </li>
            </ul>
        </div>
        <CardDate 
        creationDate={shift.createdAt}
        updateDate={shift.updatedAt}
        />
    </div>
    </CardTransition>
}

export default ShiftCard