import { useState, useEffect } from 'react'
import './prescriptions.css'
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import FiltersSection from '../components/sections/filters/filters'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import Card from '../components/cards/card'
import { formatNumber } from '../utils/numbers'
import PageHeader from '../components/sections/page-header'
import LineChart from '../components/charts/line-chart/line-chart'
import { format  } from 'date-fns'
import RateChart from '../components/charts/rate-chart/rate-chart'
import { useNavigate } from 'react-router-dom'


const DashboardV2Page = ({ roles }) => {

    const user = useSelector(state => state.user.user)
    const navigate = useNavigate()

    const [stats, setStats] = useState()
    const [reload, setReload] = useState(1)

    const [ordersGrowth, setOrdersGrowth] = useState([])
    const [ordersGroupBy, setOrdersGroupBy] = useState('MONTH')

    const [itemsStats, setItemsStats] = useState([])

    const todayDate = new Date()

    const [statsQuery, setStatsQuery] = useState({ specific: format(todayDate, 'yyyy-MM-dd') })

    useEffect(() => { 
        scroll(0, 0)
        roles.includes(user.type) ? null : navigate('/login')
    }, [])

    useEffect(() => { 
        serverRequest.get(`/v1/analytics/overview` , { params: statsQuery })
        .then(response => {
            setStats(response.data)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery])

    useEffect(() => { 
        serverRequest.get(`/v1/analytics/orders/growth` , { params: { ...statsQuery, groupBy: ordersGroupBy } })
        .then(response => {
            setOrdersGrowth(response.data.ordersGrowth)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, ordersGroupBy])

    useEffect(() => { 
        serverRequest.get(`/v1/analytics/orders/items/quantity/stats` , { params: { ...statsQuery } })
        .then(response => {
            setItemsStats(response.data.totalQuantityList)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery])

    const calculateTotal = (ratings) => {

        let total = 0
        for(let i=0;i<ratings.length;i++) {
            total += ratings[i].count
        }

        return total
    }


    return <div className="page-container page-white-background">

            <div className="padded-container">
                <PageHeader 
                pageName={'لوحة التحكم'}
                reload={reload}
                setReload={setReload}
                />
                <FiltersSection 
                setStatsQuery={setStatsQuery} 
                statsQuery={statsQuery}
                defaultValue={'0'}
                />
                <div className="cards-3-list-wrapper margin-top-1">
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'عدد المنتجات المباعة'}
                    number={formatNumber(stats?.totalQuantity ? stats?.totalQuantity : 0)}
                    iconColor={'#5C60F5'}
                    />
                    {/*<Card 
                    icon={<PaidOutlinedIcon />}
                    cardHeader={'اجمالي المدفوع'}
                    number={`${formatNumber(stats?.totalPaid ? stats?.totalPaid : 0)} EGP`}
                    isMoney={true}
                    iconColor={'#5C60F5'}
                    />*/}
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'الطلبات'}
                    number={formatNumber(stats?.totalOrders ? stats?.totalOrders : 0)}
                    iconColor={'#5C60F5'}
                    />
                    {/*<Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'معاملات الايرادات'}
                    number={formatNumber(stats?.totalRevenueRecords ? stats?.totalRevenueRecords : 0)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'معاملات المصاريف'}
                    number={formatNumber(stats?.totalExpensesRecords ? stats?.totalExpensesRecords : 0)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'حركة المخزن'}
                    number={formatNumber(stats?.totalStockRecords ? stats?.totalStockRecords : 0)}
                    iconColor={'#5C60F5'}
                    />*/}

                    <Card 
                    icon={<PaidOutlinedIcon />}
                    cardHeader={'اجمالي الايرادات'}
                    number={`${formatNumber(stats?.totalRevenue ? stats?.totalRevenue : 0)} EGP`}
                    iconColor={'#5C60F5'}
                    isMoney={true}
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
                    cardHeader={'صافي الربح'}
                    number={`${formatNumber(stats?.netProfit ? stats?.netProfit : 0)} EGP`}
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
                </div>
                <div className="cards-2-list-wrapper-gap margin-top-1">
                    <LineChart 
                    title="نمو الطلبات"
                    setGroupBy={setOrdersGroupBy}
                    labels={ordersGrowth.map(order => order._id)}
                    data={ordersGrowth.map(order => order.count)}
                    />
                    <div>
                    <RateChart 
                    title={'الاكثر مبيعا'}
                    ratings={itemsStats}
                    totalReviews={calculateTotal(itemsStats)}
                    rateNameFunction={(item) => item.item.name}
                    />
                    </div>
                </div>
        </div>
    </div>
}

export default DashboardV2Page