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
import ShiftCard from '../components/cards/shift'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import Card from '../components/cards/card'


const ShiftsPage = ({ roles }) => {

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
    const [stats, setStats] = useState({})

    const [targetUser, setTargetUser] = useState(user.type !== 'ADMIN' ? user._id : null)

    const [employees, setEmployees] = useState([])
    const [targetType, setTargetType] = useState()

    const [shifts, setShifts] = useState([])
    const [totalShifts, setTotalShifts] = useState(0)

    const todayDate = new Date()

    const [statsQuery, setStatsQuery] = useState({ specific: format(todayDate, 'yyyy-MM-dd') })

    const types = [
        { name: 'المفتوح', value: 'FALSE' },
        { name: 'المغلق', value: 'TRUE' }
    ]

    useEffect(() => {
        roles.includes(user.type) ? null : navigate('/login')
        scroll(0, 0)
    }, [])

    useEffect(() => {

        setIsLoading(true)
        serverRequest.get(`/v1/shifts`, { params: { ...statsQuery, cashierId: targetUser, isDone: targetType } })
        .then(response => {
            setIsLoading(false)
            setShifts(response.data.shifts)
            setTotalShifts(response.data.totalShifts)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery, targetUser, targetType])

    useEffect(() => {
        if(user.type !== 'ADMIN') {
            return
        }
        serverRequest.get(`/v1/shifts/stats`, { params: { ...statsQuery } })
        .then(response => {
            setStats(response.data)
        })
        .catch(error => {
            console.error(error)
        })
    }, [reload, statsQuery])

    useEffect(() => {
        if(user.type !== 'ADMIN') {
            return
        }
        serverRequest.get(`/v1/employees`)
        .then(response => {
            setEmployees(response.data.employees)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])


    const deleteShift = (shiftId) => {
        setIsDeleting(true)
        serverRequest.delete(`/v1/shifts/${shiftId}`)
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
            deleteAction={deleteShift}
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
            pageName={'الورديات'} 
            reload={reload}
            setReload={setReload}
            totalNumber={totalShifts}
            />
            <FiltersSection 
            setStatsQuery={setStatsQuery} 
            statsQuery={statsQuery}
            defaultValue={'0'}
            />
            {
                user.type !== 'ADMIN' ?
                null
                :
                <div className="cards-3-list-wrapper margin-top-1">
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'الورديات المفتوحة'}
                number={formatNumber(stats?.totalOpenedShifts ? stats?.totalOpenedShifts : 0)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'الورديات المغلقة'}
                number={formatNumber(stats?.totalClosedShifts ? stats?.totalClosedShifts : 0)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'الورديات'}
                number={formatNumber(stats?.totalShifts ? stats?.totalShifts : 0)}
                iconColor={'#5C60F5'}
                />
                </div>
            }
            
            <div className="search-input-container">
                {
                    user.type === 'ADMIN' ?
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
                        <option disabled selected>اختر الموظف</option>
                        <option value={'ALL'}>الكل</option>
                        {employees.map(employee => <option value={employee._id}>{employee.firstName}</option>)}
                    </select>
                    :
                    null
                }
                
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
                    <option disabled selected>اختر الحالة</option>
                    <option value={'ALL'}>الكل</option>
                    {types.map(type => <option value={type.value}>{type.name}</option>)}
                </select>
            </div>
            {
                isLoading ?
                <CircularLoading />
                :
                shifts.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper right-direction">
                    {shifts.map(shift =><ShiftCard 
                    shift={shift} 
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

export default ShiftsPage