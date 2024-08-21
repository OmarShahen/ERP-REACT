import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardTransition from '../transitions/card-transitions'
import { useNavigate } from 'react-router-dom'
import { formatNumber } from '../../utils/numbers'
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined'


const ItemCard = ({ 
    item, 
    setTarget, 
    setIsShowDeleteModal,
    setIsShowUpdateModal,
    setIsShowStockOrderModal,
    setIsUpdate
}) => {    

    const navigate = useNavigate()

    const cardActionsList = [
        {
            name: 'مسح منتج',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(item)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: 'تحديث منتج',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(item)
                setIsUpdate(true)
                setIsShowUpdateModal(true)
            }
        },
        {
            name: 'تسجيل معاملة',
            icon: <SwapHorizOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(item)
                setIsShowStockOrderModal(true)
            }
        }
    ]

    return <CardTransition>
    <div 
    className="patient-card-container body-text"
    onClick={e => {
        e.stopPropagation()
        setTarget(item)
        setIsUpdate(true)
        setIsShowUpdateModal(true)
    }}
    >
        <div className="patient-card-header left-direction">
            <strong>{item.name}</strong>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body item-card-body-container">
            <ul>
                <li>
                    <strong>الرقم</strong>

                    <span>#{item?.itemId}</span>
                </li>
                {/*<li>
                    <strong>وحدة الحفظ</strong>
                    <span>{item.sku ? item.sku : 'غير مسجل'}</span>
                </li>*/}
                <li>
                    <strong>الباركود</strong>
                    <span>{item.barcode ? item.barcode : 'غير مسجل'}</span>

                </li>
                <li>
                    <strong>الكمية الحالية</strong>
                    <span>{formatNumber(item.stock ? item.stock : 0)}</span>
                </li>
                {/*<li>
                    <strong>مستوي اعادة الطلب</strong>
                    <span>{formatNumber(item.reorderLevel ? item.reorderLevel : 0)}</span>
                </li>*/}
                <li>
                    <strong>السعر</strong>
                    <span>{formatNumber(item?.price)} EGP</span>
                </li>
            </ul>
            <div className="flex left-direction margin-top-1">
                <span className="status-btn pending bold-text">{item?.category?.name}</span>      
            </div>
        </div>
        <CardDate 
        creationDate={item.createdAt}
        updateDate={item.updatedAt}
        />
    </div>
    </CardTransition>
}

export default ItemCard