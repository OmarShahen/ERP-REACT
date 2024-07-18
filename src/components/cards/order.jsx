import { useState } from 'react'
import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { formatNumber } from '../../utils/numbers'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardTransition from '../transitions/card-transitions'
import { useSelector } from 'react-redux'


const OrderCard = ({ 
    order, 
    setTarget, 
    setIsShowDeleteModal,
    setIsShowUpdateModal,
}) => {

    const user = useSelector(state => state.user.user)

    const [isShowItems, setIsShowItems] = useState(false)

    const cardAdminActionsList = [
        {
            name: 'مسح الطلب',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(order)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: order.isRefunded ? 'غير مرتجع' : 'الي المرتجع',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(order)
                setIsShowUpdateModal(true)
            }
        }
    ]


    const cardEmployeeActionsList = [
        {
            name: order.isRefunded ? 'غير مرتجع' : 'الي المرتجع',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(order)
                setIsShowUpdateModal(true)
            }
        }
    ]

    return <CardTransition>
    <div className="patient-card-container body-text">
        <div className="patient-card-header left-direction">
            <div className="patient-image-info-container">
                <div>
                    <strong>#{order.orderId}</strong>
                </div>
            </div>
            <CardActions actions={user.type === 'ADMIN' ? cardAdminActionsList : cardEmployeeActionsList} />
        </div>
        <div className="patient-card-body">
            <ul>
               <li>
                    <span>الكاشير</span>
                    <span>{order?.cashier?.firstName}</span>
               </li>
               <li>
                    <span>الحالة</span>
                    {
                        order.isRefunded ?
                        <span className="status-btn declined bold-text">مرتجع</span>
                        :
                        order.isPaid ?
                        <span className="status-btn done bold-text">مدفوع</span>
                        :
                        <span className="status-btn declined bold-text">غير مدفوع</span>
                    }
               </li>
               <li>
                    <span>الاجمالي</span>
                    <span className="bold-text">{formatNumber(order.totalPrice)} EGP</span>
               </li>
               {
                isShowItems && order.items && order.items.lenght !== 0 ?
                <div className="card-details-container margin-top-1">
                        <ul className="margin-top-1">
                            {order?.items.map(item => <li>
                                <span>{item.name} ({item.quantity} {item.quantity === 1 ? 'قطعة' : 'قطع'})</span>
                                <span>{formatNumber(item.quantity * item.price)} EGP</span>
                            </li>)}
                        </ul>
               </div>
                :
                null
               }
               <li className="margin-top-1">
                    <span></span>
                    <span onClick={e => {
                        e.stopPropagation()
                        setIsShowItems(!isShowItems)
                    }} className="bold-text action-color-text">{isShowItems ? 'اخفاء التفاصيل' : 'اظهار التفاصيل'}</span>
               </li>
            </ul>
        </div>
        <CardDate 
        creationDate={order.createdAt}
        updateDate={order.updatedAt}
        />
    </div>
    </CardTransition>
}

export default OrderCard