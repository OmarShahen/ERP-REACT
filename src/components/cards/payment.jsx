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
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import { toast } from 'react-hot-toast'
import { serverRequest } from '../API/request'
import { format } from 'date-fns'


const PaymentCard = ({ 
    payment, 
    setTarget, 
    setIsShowDeleteModal,
    setReload,
    reload
}) => {

    const updateExpertPaid = (isExpertPaid) => {
        serverRequest.patch(`/v1/payments/${payment._id}/expert-paid`, { isExpertPaid })
        .then(response => {
            setReload(reload + 1)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

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
        {
            name: 'Update Expert Paid',
            icon: <PaymentsOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                updateExpertPaid(!payment.isExpertPaid)
            }
        }
    ]

    return <CardTransition>
    <div className={"patient-card-container body-text"}>
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <CardImage 
                name={payment?.expert?.firstName ? payment?.expert?.firstName : 'Unknown'} />
                <div>
                    <strong>{payment?.expert?.firstName ? payment?.expert?.firstName : 'Not Registered'}</strong>
                    <span className="grey-text">#{`${payment?.expert?.userId ? payment?.expert?.userId : 'Not Registered'}`}</span>
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
                <li>
                    <strong>Expert Paid</strong>
                    <span>
                        {
                            payment.isExpertPaid ? 
                            <span className="status-btn done bold-text">Paid</span>
                            : 
                            <span className="status-btn pending bold-text">Unpaid</span>
                        }
                    </span>
                </li>
                <li>
                    <strong>Appointment ID</strong>
                    <span>#{payment.appointment.appointmentId}</span>
                </li>
                <li>
                    <strong>Appointment Date</strong>
                    <span>{format(new Date(payment.appointment?.startTime), 'dd MMM yyyy')}</span>
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