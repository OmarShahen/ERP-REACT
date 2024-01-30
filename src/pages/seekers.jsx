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
import FloatingButton from '../components/buttons/floating-button'
import ExpertFormModal from '../components/modals/expert-form'
import DeleteConfirmationModal from '../components/modals/confirmation/delete-confirmation-modal'
import UserCard from '../components/cards/user'
import { toast } from 'react-hot-toast'

const SeekersPage = ({ roles }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    
    const [isShowModal, setIsShowModal] = useState(false)
    const [targetUser, setTargetUser] = useState({})

    const [isUpdate, setIsUpdate] = useState(false)
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)

    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [seekers, setSeekers] = useState([])
    const [totalSeekers, setTotalSeekers] = useState(0)

    const [statsQuery, setStatsQuery] = useState({})

    useEffect(() => {
        isRolesValid(user.roles, roles) ? null : navigate('/login')
        scroll(0, 0)
    }, [])

    useEffect(() => {

        setIsLoading(true)
        serverRequest.get(`/v1/seekers`, { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setSeekers(response.data.seekers)
            setTotalSeekers(response.data.totalSeekers)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery])

    const searchSeekersByName = (name) => {
        setIsLoading(true)
        serverRequest.get(`/v1/seekers/name/search`, { params: { name } })
        .then(response => {
            setIsLoading(false)
            setSeekers(response.data.seekers)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }

    const deleteSeeker = (seekerId) => {
        setIsDeleting(true)
        serverRequest.delete(`/v1/seekers/${seekerId}`)
        .then(response => {
            setIsDeleting(false)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            setIsDeleting(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }


    return <div className="page-container">
        {
            isShowDeleteModal ?
            <DeleteConfirmationModal 
            id={targetUser._id}
            isLoading={isDeleting}
            setIsShowModal={setIsShowDeleteModal}
            deleteAction={deleteSeeker}
            />
            :
            null
        }
        {
            isShowModal ?
            <ExpertFormModal 
            reload={reload}
            setReload={setReload}
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            setShowModalForm={setIsShowModal}
            />
            :
            null
        }
        
        <div className="padded-container">
            <PageHeader 
            pageName={'Seekers'} 
            reload={reload}
            setReload={setReload}
            totalNumber={totalSeekers}
            />
            <FiltersSection 
            setStatsQuery={setStatsQuery} 
            statsQuery={statsQuery}
            defaultValue={'LIFETIME'}
            />
            <div className="search-input-container">
                <SearchInput 
                searchRows={searchSeekersByName}
                isSearchRemote={true}
                isHideClinics={true}
                isShowStatus={true}
                isShowStages={true}
                />
            </div>
            
            {
                isLoading ?
                <CircularLoading />
                :
                seekers.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                    {seekers.map(user =><UserCard 
                    user={user} 
                    setReload={setReload} 
                    reload={reload} 
                    setTargetUser={setTargetUser}
                    setIsShowDeleteModal={setIsShowDeleteModal}
                    />)}
                </div>
                    
                :
                <EmptySection />
            }
        </div>
        
    </div>
}

export default SeekersPage