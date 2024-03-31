import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { serverRequest } from "../../components/API/request"
import PageHeader from '../../components/sections/page-header'
import Card from '../../components/cards/card';
import CircularLoading from '../../components/loadings/circular';
import FiltersSection from '../../components/sections/filters/filters'
import EmptySection from '../../components/sections/empty/empty'
import { formatMoney, formatNumber } from '../../utils/numbers'
import { isRolesValid } from '../../utils/roles'
import PaymentCard from '../../components/cards/payment'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import UpdateConfirmationModal from '../../components/modals/confirmation/update-confirmation-modal';
import { toast } from 'react-hot-toast'


const ExpertPaymentsPage = ({ roles }) => {

    const pagePath = window.location.pathname
    const expertId = pagePath.split('/')[2]

    const [target, setTarget] = useState({})
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowUpdateModal, setIsShowUpdateModal] = useState(false)
    const [status, setStatus] = useState()

    const [expertPaid, setExpertPaid] = useState()
    const [refunded, setRefunded] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(false)
    const [reload, setReload] = useState(1)
    const [showModalForm, setShowModalForm] = useState(false)
    const [payments, setPayments] = useState([])
    const [totalPayments, setTotalPayments] = useState(0)
    const [viewStatus, setViewStatus] = useState('ALL')

    const [totalAmountPaid, setTotalAmountPaid] = useState(0)
    const [totalAmountPaidActive, setTotalAmountPaidActive] = useState(0)
    const [totalAmountPaidRefunded, setTotalAmountPaidRefunded] = useState(0)
    const [totalAmountPaidCommission, setTotalAmountPaidCommission] = useState(0)
    const [totalAmountExpertPaid, setTotalAmountExpertPaid] = useState(0)
    const [totalAmountExpertNotPaid, setTotalAmountExpertNotPaid] = useState(0)

    const activeElementColor = { border: '2px solid #4c83ee', color: '#4c83ee' }

    const [statsQuery, setStatsQuery] = useState({})

    useEffect(() => { 
        scroll(0,0) 
        //isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/payments/experts/${expertId}`, { params: { ...statsQuery, expertPaid, refunded } })
        .then(response => {
            setIsLoading(false)
            setPayments(response.data.payments)
            setTotalPayments(response.data.totalPayments)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery, expertPaid, refunded])

    useEffect(() => {
        serverRequest.get(`/v1/payments/experts/${expertId}/statistics`, { params: statsQuery })
        .then(response => {
            setTotalAmountPaid(response.data.totalAmountPaid)
            setTotalAmountPaidActive(response.data.totalAmountPaidActive)
            setTotalAmountPaidRefunded(response.data.totalAmountPaidRefunded)
            setTotalAmountPaidCommission(response.data.totalAmountPaidCommission)
            setTotalAmountExpertPaid(response.data.totalAmountExpertPaid)
            setTotalAmountExpertNotPaid(response.data.totalAmountExpertNotPaid)
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery])

    const refundPayment = (appointmentId) => {
        setIsUpdating(true)
        serverRequest.post(`/v1/payments/full-refund/appointments/${appointmentId}`)
        .then(response => {
            setIsUpdating(false)
            setReload(reload + 1)
            setIsShowUpdateModal(false)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            setIsUpdating(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }


    return <div className="page-container">
        { 
            isShowUpdateModal ? 
            <UpdateConfirmationModal 
            target={target}
            setIsShowModal={setIsShowUpdateModal}
            isLoading={isUpdating}
            updateAction={refundPayment}
            /> 
            : 
            null 
        }
        <div className="padded-container">
            <PageHeader 
            pageName={'Payments'}
            totalNumber={totalPayments}
            isHideBackButton={true}
            setReload={setReload}
            reload={reload}
            />
            <div className="cards-4-list-wrapper">
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Total Payments'}
                number={formatNumber(totalPayments)}
                iconColor={'#FF579A'}
                />
                <Card 
                icon={<PaidOutlinedIcon />}
                cardHeader={'Total Paid'}
                number={formatMoney(totalAmountPaid)}
                isMoney={true}
                iconColor={'#FF579A'}
                />
                <Card 
                icon={<PaidOutlinedIcon />}
                cardHeader={'Total Earnings'}
                number={formatMoney(totalAmountPaidActive)}
                isMoney={true}
                iconColor={'#FF579A'}
                />
                <Card 
                icon={<PaidOutlinedIcon />}
                cardHeader={'Total Refunded'}
                number={formatMoney(totalAmountPaidRefunded)}
                isMoney={true}
                iconColor={'#FF579A'}
                />
                <Card 
                icon={<PaidOutlinedIcon />}
                cardHeader={'Our Profit'}
                number={formatMoney(totalAmountPaidCommission)}
                isMoney={true}
                iconColor={'#FF579A'}
                />
                <Card 
                icon={<PaidOutlinedIcon />}
                cardHeader={'Expert Received'}
                number={formatMoney(totalAmountExpertPaid)}
                isMoney={true}
                iconColor={'#FF579A'}
                />
                <Card 
                icon={<PaidOutlinedIcon />}
                cardHeader={'Expert Remaining'}
                number={formatMoney(totalAmountExpertNotPaid)}
                isMoney={true}
                iconColor={'#FF579A'}
                />
            </div>
            <br />
            <FiltersSection 
            statsQuery={statsQuery} 
            setStatsQuery={setStatsQuery} 
            isShowUpcomingDates={false}
            defaultValue={'LIFETIME'}
            />
            <div className="appointments-categories-container margin-top-1">
                    <div style={ viewStatus === 'ALL' ? activeElementColor : null } onClick={e => {
                        setExpertPaid()
                        setRefunded()
                        setViewStatus('ALL')
                    }}>
                        All
                    </div>
                    <div style={ viewStatus === 'PAID' ?  activeElementColor : null } onClick={e => {
                        setExpertPaid('TRUE')
                        setRefunded()
                        setViewStatus('PAID')
                    }}>
                        Expert Paid
                    </div>
                    <div style={ viewStatus === 'UNPAID' ?  activeElementColor : null } onClick={e => {
                        setExpertPaid('FALSE')
                        setRefunded()
                        setViewStatus('UNPAID')
                    }}>
                        Not Expert Paid
                    </div>
                    <div style={ viewStatus === 'REFUNDED' ?  activeElementColor : null } onClick={e => {
                        setExpertPaid()
                        setRefunded('TRUE')
                        setViewStatus('REFUNDED')
                    }}>
                        Refunded
                    </div>
                    <div style={ viewStatus === 'NOT-REFUNDED' ?  activeElementColor : null } onClick={e => {
                        setExpertPaid()
                        setRefunded('FALSE')
                        setViewStatus('NOT-REFUNDED')
                    }}>
                        Not Refunded
                    </div>
                    
            </div>
            {
                isLoading ?
                <CircularLoading />
                :
                payments.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                        {payments.map(payment => <PaymentCard 
                        payment={payment} 
                        setIsShowDeleteModal={setIsShowUpdateModal}
                        setTarget={setTarget}
                        setReload={setReload}
                        reload={reload}
                        />)}                    
                </div>
                :
                <EmptySection />
            }
        </div>
        
    </div>
}

export default ExpertPaymentsPage