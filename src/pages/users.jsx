import { useState, useEffect } from 'react'
import './prescriptions.css'
import PageHeader from '../components/sections/page-header'
import { serverRequest } from '../components/API/request'
import CircularLoading from '../components/loadings/circular'
import { useSelector } from 'react-redux'
import FiltersSection from '../components/sections/filters/filters'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { searchUsers } from '../utils/searches/search-users'
import { useNavigate } from 'react-router-dom'
import PrescriptionDeleteConfirmationModal from '../components/modals/confirmation/prescription-delete-confirmation-modal'
import { isRolesValid } from '../utils/roles'
import Card from '../components/cards/card'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import { formatNumber } from '../utils/numbers'
import FloatingButton from '../components/buttons/floating-button'
import translations from '../i18n'
import PrescriptionUpdateSurveyConfirmationModal from '../components/modals/confirmation/prescription-update-survey-confirmation-modal'
import UserCard from '../components/cards/user'


const UsersPage = ({ roles }) => {

    const navigate = useNavigate()
    
    const [isShowModal, setIsShowModal] = useState(false)
    const [targetUser, setTargetUser] = useState({})

    const [isShowUpdateSurveyModal, setIsShowUpdateSurveyModal] = useState(false)

    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [users, setUsers] = useState([])
    const [searchedUsers, setSearchedUsers] = useState([])

    const [viewStatus, setViewStatus] = useState('ALL')

    const activeElementColor = { border: '2px solid #4c83ee', color: '#4c83ee' }

    const todayDate = new Date()
    const weekDate = new Date()

    todayDate.setDate(todayDate.getDate() + 1)
    weekDate.setDate(weekDate.getDate() - 7)

    const [statsQuery, setStatsQuery] = useState({ from: weekDate, to: todayDate })

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    useEffect(() => {
        //isRolesValid(user.roles, roles) ? null : navigate('/login')
        scroll(0,0)
    }, [])

    useEffect(() => {

        let endpointURL = `/v1/users/roles/app`

        setIsLoading(true)
        serverRequest.get(endpointURL, { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setUsers(response.data.users)
            setSearchedUsers(response.data.users)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery])


    return <div className="page-container">
        <div className="padded-container">
            <PageHeader 
            pageName={'Users'} 
            reload={reload}
            setReload={setReload}
            totalNumber={users.length}
            />
            <FiltersSection 
            setStatsQuery={setStatsQuery} 
            statsQuery={statsQuery}
            defaultValue={'-7'}
            />

            <div className="search-input-container">
                <SearchInput 
                rows={users} 
                setRows={setSearchedUsers}
                searchRows={searchUsers}
                isHideClinics={true}
                />
            </div>
            {
                isLoading ?
                <CircularLoading />
                :
                searchedUsers.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                    {searchedUsers.map(user =><UserCard 
                    user={user} 
                    setReload={setReload} 
                    reload={reload} 
                    setTargetUser={setTargetUser}
                    />)}
                </div>
                    
                :
                <EmptySection />
            }
        </div>
        
    </div>
}

export default UsersPage