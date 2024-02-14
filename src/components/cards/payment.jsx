import { useState } from 'react'
import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { useNavigate } from 'react-router-dom'
import { formatMoney } from '../../utils/numbers'
import { useSelector } from 'react-redux'
import CardTransition from '../transitions/card-transitions'
import CardImage from './components/image'

const PaymentCard = ({ 
    payment, 
    setTarget, 
    setIsShowDeleteModal,
}) => {

    const cardActionsList = [
        {
            name: 'Refund Payment',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(payment)
                setIsShowDeleteModal(true)
            }
        },
    ]

    return <CardTransition>
    <div className={"patient-card-container body-text"}>
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <CardImage 
                name={payment?.seeker?.firstName ? payment?.seeker?.firstName : 'Unknown'} />
                <div>
                    <strong>{payment?.seeker?.firstName ? payment?.seeker?.firstName : 'Not Registered'}</strong>
                    <span className="grey-text">{`${payment?.seeker?.userId ? payment?.seeker?.userId : 'Not Registered'}`}</span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>ID</strong>
                    <span>#{payment.paymentId}</span>
                </li>
                <li>
                    <strong>Expert</strong>
                    <span>{payment?.expert?.firstName ? payment?.expert?.firstName : 'Not registered'}</span>
                </li>
                <li>
                    <strong>Seeker</strong>
                    <span>{payment?.seeker?.firstName ? payment?.seeker?.firstName : 'Not registered'}</span>
                </li>
                <li>
                    <strong>Status</strong>
                    {
                        payment.success ?
                        <span className="status-btn done bold-text">Accepted</span>
                        :
                        <span className="status-btn declined bold-text">Declined</span>
                    }
                </li>
                <li>
                    <strong>Refunded</strong>
                    {
                        payment.isRefunded ?
                        <span>Yes</span>
                        :
                        <span>No</span>
                    }
                </li>
                <li>
                    <strong>Paid</strong>
                    <span>{formatMoney(payment.amountCents/100)}</span>
                </li>
                <li>
                    <strong>Commission</strong>
                    <span>{formatMoney(payment.amountCents * (payment.commission ? payment.commission : 0.1) / 100)}</span>
                </li>
            </ul>
        </div>
        
        <CardDate 
        creationDate={payment.createdAt}
        updateDate={payment.updatedAt}
        />
    </div>
    </CardTransition>
}

export default PaymentCard