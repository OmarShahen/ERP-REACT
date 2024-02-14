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


const DashboardPage = ({ roles }) => {

    const [stats, setStats] = useState()
    const [statsQuery, setStatsQuery] = useState()
    const [reload, setReload] = useState(1)

    const [appointmentsGrowth, setAppointmentsGrowth] = useState([])
    const [appointmentsGroupBy, setAppointmentsGroupBy] = useState('MONTH')

    const [expertsVerificationsGrowth, setExpertsVerificationsGrowth] = useState([])
    const [verificationsGroupBy, setVerificationsGroupBy] = useState('MONTH')

    const [seekersGrowth, setSeekersGrowth] = useState([])
    const [seekersGroupBy, setSeekersGroupBy] = useState('MONTH')

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
        serverRequest.get(`/v1/stats/appointments/growth` , { params: { ...statsQuery, groupBy: appointmentsGroupBy } })
        .then(response => {
            setAppointmentsGrowth(response.data.appointmentsGrowth)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, appointmentsGroupBy])

    useEffect(() => { 
        serverRequest.get(`/v1/stats/experts-verifications/growth` , { params: { ...statsQuery, groupBy: verificationsGroupBy } })
        .then(response => {
            setExpertsVerificationsGrowth(response.data.expertsVerificationsGrowth)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, verificationsGroupBy])

    useEffect(() => { 
        serverRequest.get(`/v1/analytics/users/growth` , { params: { ...statsQuery, type: 'SEEKER', groupBy: seekersGroupBy } })
        .then(response => {
            setSeekersGrowth(response.data.usersGrowth)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, seekersGroupBy])


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
                    cardHeader={'Seekers'}
                    number={formatNumber(stats?.totalSeekers ? stats?.totalSeekers : 0)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Experts'}
                    number={formatNumber(stats?.totalExperts ? stats?.totalExperts : 0)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Appointments'}
                    number={formatNumber(stats?.totalAppointments ? stats?.totalAppointments : 0)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Experts Verifications'}
                    number={formatNumber(stats?.totalExpertVerifications ? stats?.totalExpertVerifications : 0)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Reviews'}
                    number={formatNumber(stats?.totalReviews ? stats?.totalReviews : 0)}
                    iconColor={'#5C60F5'}
                    />
                    <Card 
                    icon={<NumbersOutlinedIcon />}
                    cardHeader={'Reviews Rating'}
                    number={stats?.reviewsRating ? stats?.reviewsRating : 0}
                    isMoney={true}
                    iconColor={'#5C60F5'}
                    />
                </div>
                <div className="margin-top-1">
                    <LineChart 
                    title="Seekers Growth"
                    setGroupBy={setSeekersGroupBy}
                    labels={seekersGrowth.map(seeker => seeker._id)}
                    data={seekersGrowth.map(seeker => seeker.count)}
                    />
                </div>
                <div className="margin-top-1">
                    <LineChart 
                    title="Appointments Growth"
                    setGroupBy={setAppointmentsGroupBy}
                    labels={appointmentsGrowth.map(appointment => appointment._id)}
                    data={appointmentsGrowth.map(appointment => appointment.count)}
                    />
                </div>
                <div className="margin-top-1">
                    <LineChart 
                    title="Experts Verifications Growth"
                    setGroupBy={setVerificationsGroupBy}
                    labels={expertsVerificationsGrowth.map(expertsVerification => expertsVerification._id)}
                    data={expertsVerificationsGrowth.map(expertsVerification => expertsVerification.count)}
                    />
                </div>
        </div>
    </div>
}

export default DashboardPage