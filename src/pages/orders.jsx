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
import OrderCard from '../components/cards/order'
import { format  } from 'date-fns'
import Card from '../components/cards/card'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import { formatNumber } from '../utils/numbers'

const OrdersPage = ({ roles }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    
    const [isShowModal, setIsShowModal] = useState(false)
    const [target, setTarget] = useState({})

    const [isUpdate, setIsUpdate] = useState(false)
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowUpdateModal, setIsShowUpdateModal] = useState(false)

    const [isDeleting, setIsDeleting] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [orders, setOrders] = useState([])
    const [totalOrders, setTotalOrders] = useState(0)
    const [stats, setStats] = useState({})

    const [employees, setEmployees] = useState([])
    const [cashierId, setCashierId] = useState()
    const [refundStatus, setRefundStatus] = useState()

    const todayDate = new Date()

    const [statsQuery, setStatsQuery] = useState({ specific: format(todayDate, 'yyyy-MM-dd') })


    useEffect(() => {
        roles.includes(user.type) ? null : navigate('/login')
        scroll(0, 0)
    }, [])

    useEffect(() => {

        setIsLoading(true)
        serverRequest.get(`/v1/orders`, { params: { ...statsQuery, cashierId, isRefunded: refundStatus } })
        .then(response => {
            setIsLoading(false)
            setOrders(response.data.orders)
            setTotalOrders(response.data.totalOrders)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery, cashierId, refundStatus])

    useEffect(() => {
        serverRequest.get(`/v1/analytics/orders/stats`, { params: { ...statsQuery, cashierId } })
        .then(response => {
            setStats(response.data)
        })
        .catch(error => {
            console.error(error)
        })
    }, [reload, statsQuery, cashierId])

    useEffect(() => {
        serverRequest.get(`/v1/employees`)
        .then(response => {
            setEmployees(response.data.employees)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])


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

    const searchOrdersById = (value) => {
        if(!value) {
            setReload(reload + 1)
            return
        }
        setIsLoading(true)
        serverRequest.get(`/v1/orders/${value}/numeric`)
        .then(response => {
            setIsLoading(false)
            setOrders(response.data.orders)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
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
            pageName={'الطلبات'} 
            reload={reload}
            setReload={setReload}
            totalNumber={totalOrders}
            addBtnText={'اضافة طلب'}
            formURL={'/pos'}
            />
            <FiltersSection 
            setStatsQuery={setStatsQuery} 
            statsQuery={statsQuery}
            defaultValue={'0'}
            />
            <div className="cards-4-list-wrapper margin-top-1">
                    <Card
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'عدد الطلبات المرتجعة'}
                    number={formatNumber(stats?.totalRefundedOrders ? stats?.totalRefundedOrders : 0)}
                    iconColor={'#5C60F5'}
                    />
                    <Card
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'عدد المنتجات المباعة'}
                    number={formatNumber(stats?.totalQuantity ? stats?.totalQuantity : 0)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<PaidOutlinedIcon />}
                    cardHeader={'اجمالي المدفوع'}
                    number={`${formatNumber(stats?.totalPaid ? stats?.totalPaid : 0)} EGP`}
                    isMoney={true}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'الطلبات المدفوعة'}
                    number={formatNumber(stats?.totalPaidOrders ? stats?.totalPaidOrders : 0)}
                    iconColor={'#5C60F5'}
                    />
            </div>
            <div className="search-input-container">
                <SearchInput searchRows={searchOrdersById} />
                <select
                className="form-input"
                onChange={e => {
                    const value = e.target.value

                    if(value === 'ALL') {
                        setCashierId()
                        return
                    }

                    setCashierId(value)
                }}
                >
                    <option disabled selected>اختر الكاشير</option>
                    <option value={'ALL'}>الكل</option>
                    {employees.map(employee => <option value={employee._id}>{employee.firstName}</option>)}
                </select>
                <select
                className="form-input"
                onChange={e => {
                    const value = e.target.value

                    if(value === 'ALL') {
                        setRefundStatus()
                        return
                    }

                    setRefundStatus(value)
                }}
                >
                    <option>اختر الحالة</option>
                    <option value={'ALL'}>الكل</option>
                    <option value={'FALSE'}>المدفوع</option>
                    <option value={'TRUE'}>المرتجع</option>
                </select>
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
                <EmptySection url={'/pos'} />
            }
        </div>
        
    </div>
}

export default OrdersPage