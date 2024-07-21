import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardTransition from '../transitions/card-transitions'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { useNavigate } from 'react-router-dom'
import { formatNumber } from '../../utils/numbers'
import BakeryDiningOutlinedIcon from '@mui/icons-material/BakeryDiningOutlined'
import { toast } from 'react-hot-toast'
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'


const POSItemCard = ({ 
    item, 
    setOrderItems,
    orderItems,
    setTarget, 
    setIsShowDeleteModal,
    setIsShowUpdateModal,
    setIsUpdate
}) => {    

    return <CardTransition>
    <div 
    className="pos-item-card-container body-text"
    onClick={() => {
      const registeredItems = orderItems.filter(orderItem => orderItem._id === item._id)
      if(registeredItems.length !== 0) {
        return toast.error('المنتج مسجل مسبقا', { duration: 3000, position: 'top-left' })
      }
      setOrderItems([...orderItems, { ...item, quantity: 1 }])
    }}
    >
      <div className="pos-item-card-icon-container grey-text">
        <CakeOutlinedIcon />
      </div>
      <div>
        <div className="flex margin-top-1">
            <span className="grey-text bold-text body-text">{item.name}</span>
        </div>
        <div className="flex">
            <strong>{formatNumber(item.price)} EGP</strong>
        </div>
      </div>
      <div className="flex-space-between-center margin-top-1">
      <strong className="status-btn grey-bg flex-space-between-center">{item.stock === 0 ? 'لا يوجد' : item.stock !== 1 ? `${item.stock} قطعة` : `${item.stock} قطع`}</strong>
        <span className="status-btn pending bold-text">{item?.category?.name}</span>
      </div>
    </div>
    </CardTransition>
}


export default POSItemCard