import { useState, useEffect } from 'react'
import './prescriptions.css'
import PageHeader from '../components/sections/page-header'
import { serverRequest } from '../components/API/request'
import CircularLoading from '../components/loadings/circular'
import { useSelector } from 'react-redux'
import FiltersSection from '../components/sections/filters/filters'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { useNavigate } from 'react-router-dom'
import { isRolesValid } from '../utils/roles'
import DeleteConfirmationModal from '../components/modals/confirmation/delete-confirmation-modal'
import UpdateConfirmationModal from '../components/modals/confirmation/update-confirmation-modal'
import { toast } from 'react-hot-toast'
import { format  } from 'date-fns'
import { formatNumber } from '../utils/numbers'
import StockRecordCard from '../components/cards/stock-record'
import SearchItemsInputField from '../components/inputs/search-items'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import Card from '../components/cards/card'
import OrderCard from '../components/cards/order'

const ShiftPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const shiftId = pagePath.split('/')[2]

    const user = useSelector(state => state.user.user)
    
    const [target, setTarget] = useState({})

    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowUpdateModal, setIsShowUpdateModal] = useState(false)

    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [stats, setStats] = useState({})

    const [shift, setShift] = useState()
    const [cashier, setCashier] = useState()

    const [isUpdate, setIsUpdate] = useState()
    const [isUpdating, setIsUpdating] = useState(false)

    const [orders, setOrders] = useState([])

    useEffect(() => {
        roles.includes(user.type) ? null : navigate('/login')
        scroll(0, 0)
    }, [])

    useEffect(() => {

        setIsLoading(true)
        serverRequest.get(`/v1/shifts/${shiftId}/orders`)
        .then(response => {
            setIsLoading(false)
            setOrders(response.data.orders)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])

    useEffect(() => {
        serverRequest.get(`/v1/shifts/${shiftId}`)
        .then(response => {
            setShift(response.data.shift)
            setCashier(response.data.cashier)
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-left' })
        })
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/shifts/${shiftId}/orders/stats`)
        .then(response => {
            setStats(response.data)
        })
        .catch(error => {
            console.error(error)
        })
    }, [reload])


    const deleteOrder = (orderId) => {
        setIsDeleting(true)
        serverRequest.delete(`/v1/orders/${orderId}`)
        .then(response => {
            setIsDeleting(false)
            setReload(reload + 1)
            setIsShowDeleteModal(false)
            toast.success(response.data.message, { duration: 3000, position: 'top-left' })
        })
        .catch(error => {
            setIsDeleting(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-left' })
        })
    }

    const updateOrderRefunding = (orderId, isRefunded) => {

        const refundData = { isRefunded }
        if(isRefunded) {
            refundData.refunderId = user._id
        }

        setIsUpdating(true)
        serverRequest.patch(`/v1/orders/${orderId}/refunding`, refundData)
        .then(response => {
            setIsUpdating(false)
            setReload(reload + 1)
            setIsShowUpdateModal(false)
            toast.success(response.data.message, { duration: 3000, position: 'top-left' })
        })
        .catch(error => {
            setIsUpdating(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-left' })
        })
    }

    return <div className="page-container">
        {
            isShowDeleteModal ?
            <DeleteConfirmationModal 
            id={target._id}
            isLoading={isDeleting}
            setIsShowModal={setIsShowDeleteModal}
            deleteAction={deleteOrder}
            />
            :
            null
        }

        {
            isShowUpdateModal ?
            <UpdateConfirmationModal 
            target={target}
            isLoading={isUpdating}
            setIsShowModal={setIsShowUpdateModal}
            updateAction={() => updateOrderRefunding(target._id, !target.isRefunded)}
            />
            :
            null
        }

        <div className="padded-container">
            <PageHeader 
            pageName={shift ? `وردية رقم ${shift.shiftId}` : '...تحميل'} 
            reload={reload}
            setReload={setReload}
            />
            <div className="cards-3-list-wrapper margin-top-1">
                <Card 
                icon={<PaidOutlinedIcon />}
                cardHeader={'الاعجاز'}
                number={`${formatNumber(stats?.shortageBalance ? stats?.shortageBalance : 0)} EGP`}
                iconColor={'#5C60F5'}
                isMoney={true}
                />
                <Card 
                icon={<PaidOutlinedIcon />}
                cardHeader={'المبلغ المتوقع'}
                number={`${formatNumber(stats?.estimatedBalance ? stats?.estimatedBalance : 0)} EGP`}
                iconColor={'#5C60F5'}
                isMoney={true}
                />
                <Card 
                icon={<PaidOutlinedIcon />}
                cardHeader={'مبلغ الاغلاق'}
                number={`${formatNumber(stats?.closingBalance ? stats?.closingBalance : 0)} EGP`}
                iconColor={'#5C60F5'}
                isMoney={true}
                />
                <Card 
                icon={<PaidOutlinedIcon />}
                cardHeader={'اجمالي الطلبات'}
                number={`${formatNumber(stats?.totalPaid ? stats?.totalPaid : 0)} EGP`}
                iconColor={'#5C60F5'}
                isMoney={true}
                />
                <Card 
                icon={<PaidOutlinedIcon />}
                cardHeader={'مبلغ الفتح'}
                number={`${formatNumber(stats?.openingBalance ? stats?.openingBalance : 0)} EGP`}
                iconColor={'#5C60F5'}
                isMoney={true}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'عدد الطلبات'}
                number={`${formatNumber(stats?.totalPaidOrders ? stats?.totalPaidOrders : 0)}`}
                iconColor={'#5C60F5'}
                />
            </div>
           
            <div className="search-input-container">
                <div className="form-input-container">
                    <label className="bold-text">الكاشير</label>
                    <input 
                    type="text"
                    disabled
                    className="form-input"
                    value={cashier ? cashier.firstName : 'غير مسجل'}
                    />
                </div>
                <div className="form-input-container">
                    <label className="bold-text">بدء الوردية</label>
                    <input 
                    type="text"
                    disabled
                    className="form-input"
                    value={shift && shift.startTime ? format(new Date(shift.startTime), 'hh:mm a yyyy/MM/dd') : 'غير مسجل'}
                    />
                </div>
                <div className="form-input-container"> 
                    <label className="bold-text">انتهاء الوردية</label>
                    <input 
                    type="text"
                    disabled
                    className="form-input"
                    value={shift && shift.endTime ? format(new Date(shift.endTime), 'hh:mm a yyyy/MM/dd') : 'غير مسجل'}
                    />
                </div>
            </div>
            {
                isLoading ?
                <CircularLoading />
                :
                orders.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper right-direction">
                    {orders.map(order =><OrderCard
                    order={order} 
                    setReload={setReload} 
                    reload={reload} 
                    setTarget={setTarget}
                    setIsUpdate={setIsUpdate}
                    setIsShowDeleteModal={setIsShowDeleteModal}
                    setIsShowUpdateModal={setIsShowUpdateModal}
                    />)}
                </div>
                :
                <EmptySection />
            }
        </div>
        
    </div>
}

export default ShiftPage