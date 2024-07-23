import { formatNumber } from '../../utils/numbers'
import './receipt.css'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import { TailSpin } from 'react-loader-spinner'


const Receipt = ({ orderItems, setOrderItems, onSubmit, isSubmit }) => {

    const getTotalPrice = (items) => {

        let totalPrice = 0

        for(let i=0;i<items.length;i++) {
            totalPrice += items[i].quantity * items[i].price
        }

        return totalPrice
    }

    return <div className="white-bg receipt-container">
        <div className="receipt-order-items-container">
            <ul className="grey-text body-text">
                {orderItems.map((item, index) => <li>
                    <div>
                        <span>{item.name}</span>
                        <span
                        className="grey-text receipt-close-icon"
                        onClick={() => {
                            setOrderItems(orderItems.filter(orderItem => orderItem._id !== item._id))
                        }}
                        >
                            <HighlightOffOutlinedIcon />
                        </span>
                    </div>
                    <div>
                        <span className="receipt-quantity-controller-container">
                            <span
                            onClick={() => {
                                setOrderItems(orderItems.map(orderItem => {
                                    if(orderItem._id === item._id) {
                                        const addValue = item.quantity < 1 ? 0.1 : 1
                                        const newOrderItem = { ...item, quantity: Number.parseFloat((item.quantity + addValue).toFixed(2)) }
                                        return newOrderItem
                                    }

                                    return orderItem
                                }))
                            }}
                            >
                                <AddOutlinedIcon />
                            </span>
                            <span>{item.quantity}</span>
                            <span
                            onClick={() => {
                                setOrderItems(orderItems.map(orderItem => {
                                    if(orderItem._id === item._id && item.quantity !== 0.1) {
                                        const subtractValue = item.quantity <= 1 ? 0.1 : 1
                                        const newOrderItem = { ...item, quantity: Number.parseFloat((item.quantity - subtractValue).toFixed(2)) }
                                        return newOrderItem
                                    }

                                    return orderItem
                                }))
                            }}
                            >
                                <RemoveOutlinedIcon />
                            </span>
                        </span>
                        <strong>{formatNumber(item.price * item.quantity)} EGP</strong>

                    </div>
                </li>)} 
            </ul>
        </div>
        <div className="receipt-price-container">
            <strong>{formatNumber(getTotalPrice(orderItems))} EGP</strong>
            <strong className="grey-text">الاجمالي</strong>
        </div>
        <div className="receipt-total-contaier">
           <button 
           className="normal-button cancel-button span-text center bold-text"
           onClick={() => setOrderItems([])}
           >
            الغاء 
            <HighlightOffOutlinedIcon />

            </button>
            {
                isSubmit ?
                <div className="center">
                    <TailSpin width="25" height="25" color="#4c83ee" />
                </div>
                :
                <button 
                onClick={onSubmit}
                className="normal-button white-text action-color-bg span-text bold-text center">
                    تاكيد
                <CheckCircleOutlinedIcon />
                </button>
            }
        </div>
    </div>
}

export default Receipt