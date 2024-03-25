import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardTransition from '../transitions/card-transitions'
import { format } from 'date-fns'
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined'
import { toast } from 'react-hot-toast'
import { serverRequest } from '../API/request'
import { formatNumber } from '../../utils/numbers'


const PromoCodeCard = ({ 
    promoCode, 
    setTarget, 
    setIsUpdate,
    setIsShowDeleteModal,
    setIsShowForm,
    setReload,
    reload
}) => {

    const updatePromoCodeActivity = (isActive) => {
        serverRequest.patch(`/v1/promo-codes/${promoCode._id}/activity`, { isActive })
        .then(response => {
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
            setReload(reload + 1)
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    const cardActionsList = [
        {
            name: 'Delete Coupon',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(promoCode)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: 'Update Coupon',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(promoCode)
                setIsUpdate(true)
                setIsShowForm(true)
            }
        },
        {
            name: promoCode.isActive ? 'Deactivate' : 'Activate',
            icon: <ToggleOnOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                updatePromoCodeActivity(!promoCode.isActive)
            }
        },
     ]

    return <CardTransition>
        <div 
        className="patient-card-container body-text disable-hover">
            <div className="patient-card-header">
                <div className="patient-image-info-container">
                    <div>
                        <strong>{promoCode.code}</strong>
                    </div>
                </div>
                <CardActions actions={cardActionsList} />
            </div>
            <div className="patient-card-body">
                <ul>
                    <li>
                        <strong>Discount</strong>
                        <span>{promoCode.percentage*100}%</span>
                    </li>
                    <li>
                        <strong>Status</strong>
                        {
                            promoCode.isActive ?
                            <span className="status-btn done bold-text">Active</span>
                            :
                            <span className="status-btn grey-bg black-text bold-text">Deactivated</span>
                        }
                    </li>
                    <li>
                        <strong>Max. usage</strong>
                        <span>{promoCode.maxUsage === 0 ? 'Infinity' : formatNumber(promoCode.maxUsage)}</span>
                    </li>
                    <li>
                        <strong>User max. usage</strong>
                        <span>{formatNumber(promoCode.userMaxUsage)}</span>
                    </li>
                    <li>
                        <strong>Expiration Date</strong>
                        {
                            promoCode.expirationDate ?
                            <span>{format(new Date(promoCode?.expirationDate), 'dd MMM yyyy')}</span>
                            :
                            <span>Not Registered</span>
                        }
                    </li>
                </ul>
            </div>
            <CardDate 
            creationDate={promoCode.createdAt}  
            updateDate={promoCode.updatedAt} 
            />
        </div>
    </CardTransition>
}

export default PromoCodeCard