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
import { formatNumber } from '../utils/numbers'
import StockRecordCard from '../components/cards/stock-record'
import SearchItemsInputField from '../components/inputs/search-items'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import Card from '../components/cards/card'


const StockRecordsPage = ({ roles }) => {

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

    const [items, setItems] = useState()
    const [targetItem, setTargetItem] = useState()
    const [targetItemError, setTargetItemError] = useState()

    const [targetUser, setTargetUser] = useState()

    const [employees, setEmployees] = useState([])
    const [cashierId, setCashierId] = useState()
    const [targetType, setTargetType] = useState()

    const [stockRecords, setStockRecords] = useState([])
    const [totalStockRecords, setTotalStockRecords] = useState(0)

    const todayDate = new Date()

    const [statsQuery, setStatsQuery] = useState({ specific: format(todayDate, 'yyyy-MM-dd') })

    const types = [
        { name: 'استلام', value: 'PURCHASE' },
        { name: 'بيع', value: 'SALE' },
        { name: 'استرجاع', value: 'RETURN' },
        { name: 'تعديل', value: 'ADJUSTMENT' },
        { name: 'اتلاف', value: 'DAMAGE' },
        { name: 'سرقة', value: 'THEFT' },
    ]

    useEffect(() => {
        roles.includes(user.type) ? null : navigate('/login')
        scroll(0, 0)
    }, [])

    useEffect(() => {

        setIsLoading(true)
        serverRequest.get(`/v1/stock-records`, { params: { ...statsQuery, itemId: targetItem, userId: targetUser, type: targetType } })
        .then(response => {
            setIsLoading(false)
            setStockRecords(response.data.stockRecords)
            setTotalStockRecords(response.data.totalStockRecords)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery, targetItem, targetUser, targetType])

    useEffect(() => {
        serverRequest.get(`/v1/analytics/stock-records/stats`, { params: { ...statsQuery } })
        .then(response => {
            setStats(response.data)
        })
        .catch(error => {
            console.error(error)
        })
    }, [reload, statsQuery])

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
            pageName={'المخزن'} 
            reload={reload}
            setReload={setReload}
            totalNumber={totalStockRecords}
            />
            <FiltersSection 
            setStatsQuery={setStatsQuery} 
            statsQuery={statsQuery}
            defaultValue={'0'}
            />
           <div className="cards-3-list-wrapper margin-top-1">
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'معاملات المصاريف'}
                number={formatNumber(stats?.totalExpensesRecords ? stats?.totalExpensesRecords : 0)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'معاملات الايرادات'}
                number={formatNumber(stats?.totalRevenueRecords ? stats?.totalRevenueRecords : 0)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<PaidOutlinedIcon />}
                cardHeader={'قيمة المخزن الحالي'}
                number={`${formatNumber(stats?.totalInventoryValue ? stats?.totalInventoryValue : 0)} EGP`}
                iconColor={'#5C60F5'}
                isMoney={true}
                />
                <Card 
                icon={<PaidOutlinedIcon />}
                cardHeader={'اجمالي المصاريف'}
                number={`${formatNumber(stats?.totalExpenses ? stats?.totalExpenses : 0)} EGP`}
                iconColor={'#5C60F5'}
                isMoney={true}
                />
                <Card 
                icon={<PaidOutlinedIcon />}
                cardHeader={'اجمالي الايرادات'}
                number={`${formatNumber(stats?.totalRevenue ? stats?.totalRevenue : 0)} EGP`}
                iconColor={'#5C60F5'}
                isMoney={true}
                />
                <Card 
                icon={<PaidOutlinedIcon />}
                cardHeader={'صافي الربح'}
                number={`${formatNumber(stats?.netProfit ? stats?.netProfit : 0)} EGP`}
                iconColor={'#5C60F5'}
                isMoney={true}
                />
                </div>
            <div className="search-input-container">
                <SearchItemsInputField
                placeholder={'ابحث في المنتجات'}
                setTargetItem={setTargetItem}
                setTargetItemError={setTargetItemError}
                targetItemError={targetItemError}
                />
                <select
                className="form-input"
                onChange={e => {
                    const value = e.target.value

                    if(value === 'ALL') {
                        setTargetUser()
                        return
                    }

                    setTargetUser(value)
                }}
                >
                    <option disabled selected>اختر المسجل</option>
                    <option value={'ALL'}>الكل</option>
                    {employees.map(employee => <option value={employee._id}>{employee.firstName}</option>)}
                </select>
                <select
                className="form-input"
                onChange={e => {
                    const value = e.target.value

                    if(value === 'ALL') {
                        setTargetType()
                        return
                    }

                    setTargetType(value)
                }}
                >
                    <option disabled selected>اختر فئة المعاملة</option>
                    <option value={'ALL'}>الكل</option>
                    {types.map(type => <option value={type.value}>{type.name}</option>)}
                </select>
            </div>
            {
                isLoading ?
                <CircularLoading />
                :
                stockRecords.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper right-direction">
                    {stockRecords.map(stockRecord =><StockRecordCard 
                    stockRecord={stockRecord} 
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

export default StockRecordsPage