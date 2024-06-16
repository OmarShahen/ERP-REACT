import { useState, useEffect } from 'react'
import './prescriptions.css'
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { isRolesValid } from '../utils/roles'
import FiltersSection from '../components/sections/filters/filters'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import Card from '../components/cards/card'
import { formatNumber } from '../utils/numbers'
import PageHeader from '../components/sections/page-header'
import LineChart from '../components/charts/line-chart/line-chart'


const DashboardV2Page = ({ roles }) => {

    const [stats, setStats] = useState()
    const [statsQuery, setStatsQuery] = useState()
    const [reload, setReload] = useState(1)

    const [customersGrowth, setCustomersGrowth] = useState([])
    const [customersGroupBy, setCustomersGroupBy] = useState('MONTH')

    const [itemsGrowth, setItemsGrowth] = useState([])
    const [itemsGroupBy, setItemsGroupBy] = useState('MONTH')

    useEffect(() => { 
        //scroll(0, 0)
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
        serverRequest.get(`/v1/analytics/customers/growth` , { params: { ...statsQuery, groupBy: customersGroupBy } })
        .then(response => {
            setCustomersGrowth(response.data.customersGrowth)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, customersGroupBy])

    useEffect(() => { 
        serverRequest.get(`/v1/analytics/items/growth` , { params: { ...statsQuery, groupBy: itemsGroupBy } })
        .then(response => {
            setItemsGrowth(response.data.itemsGrowth)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, itemsGroupBy])


    return <div className="page-container page-white-background">

            <div className="padded-container">
                <PageHeader 
                pageName={'Dashboard'}
                reload={reload}
                setReload={setReload}
                />
                <FiltersSection 
                setStatsQuery={setStatsQuery} 
                statsQuery={statsQuery}
                defaultValue={'LIFETIME'}
                />
                <div className="cards-3-list-wrapper margin-top-1">
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Customers'}
                    number={formatNumber(stats?.totalCustomers ? stats?.totalCustomers : 0)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Items'}
                    number={formatNumber(stats?.totalItems ? stats?.totalItems : 0)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'For Selling Items'}
                    number={formatNumber(stats?.totalSellingItems ? stats?.totalSellingItems : 0)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'For Renting Items'}
                    number={formatNumber(stats?.totalRentingItems ? stats?.totalRentingItems : 0)}
                    iconColor={'#5C60F5'}
                    />
                    
                </div>
                <div className="margin-top-1">
                    <LineChart 
                    title="Customers Growth"
                    setGroupBy={setCustomersGroupBy}
                    labels={customersGrowth.map(customer => customer._id)}
                    data={customersGrowth.map(customer => customer.count)}
                    />
                </div>
                <div className="margin-top-1">
                    <LineChart 
                    title="Items Growth"
                    setGroupBy={setItemsGroupBy}
                    labels={itemsGrowth.map(item => item._id)}
                    data={itemsGrowth.map(item => item.count)}
                    />
                </div>
        </div>
    </div>
}

export default DashboardV2Page