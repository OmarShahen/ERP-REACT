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
import ExpertFormModal from '../components/modals/expert-form'
import DeleteConfirmationModal from '../components/modals/confirmation/delete-confirmation-modal'
import UserCard from '../components/cards/user'
import { toast } from 'react-hot-toast'
import SelectInputField from '../components/inputs/select'


const UsersPage = ({ roles }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    
    const [isShowModal, setIsShowModal] = useState(false)
    const [targetUser, setTargetUser] = useState({})

    const [isUpdate, setIsUpdate] = useState(false)
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)

    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [experts, setExperts] = useState([])
    const [totalExperts, setTotalExperts] = useState(0)

    const [specialities, setSpecialities] = useState([])
    const [speciality, setSpeciality] = useState()

    const [statsQuery, setStatsQuery] = useState({})

    useEffect(() => {
        isRolesValid(user.roles, roles) ? null : navigate('/login')
        scroll(0, 0)
    }, [])

    useEffect(() => {
        serverRequest.get('/v1/specialities')
        .then(response => {
            let specialities = response.data.specialities
            specialities = [{ name: 'All', _id: 'ALL' }, ...specialities]
            setSpecialities(specialities)
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [])

    useEffect(() => {

        setIsLoading(true)
        serverRequest.get(`/v1/experts`, { params: { ...statsQuery, speciality } })
        .then(response => {
            setIsLoading(false)
            setExperts(response.data.experts)
            setTotalExperts(response.data.totalExperts)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery, speciality])

    const searchExpertsByName = (name) => {
        setIsLoading(true)
        serverRequest.get(`/v1/experts/name/search`, { params: { name } })
        .then(response => {
            setIsLoading(false)
            setExperts(response.data.experts)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }

    const deleteExpert = (expertId) => {
        setIsDeleting(true)
        serverRequest.delete(`/v1/experts/${expertId}`)
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
            deleteAction={deleteExpert}
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
            pageName={'Experts'} 
            reload={reload}
            setReload={setReload}
            totalNumber={totalExperts}
            addBtnText={'Add Expert'}
            setShowModalForm={setIsShowModal}
            />
            <FiltersSection 
            setStatsQuery={setStatsQuery} 
            statsQuery={statsQuery}
            defaultValue={'LIFETIME'}
            />
            
            <div className="search-input-container">
                    <SearchInput 
                    searchRows={searchExpertsByName}
                    isSearchRemote={true}
                    isHideClinics={true}
                    isShowStatus={true}
                    isShowStages={true}
                    />
            </div>
            <div className="cards-3-list-wrapper margin-bottom-1">
                <SelectInputField 
                selectLabel='Select Speciality'
                options={specialities}
                isNested={true}
                actionFunction={(specialityId) => {
                    if(specialityId === 'ALL') {
                        return setSpeciality()
                    }
                    setSpeciality(specialityId)
                }}
                />
            </div>
            
            {
                isLoading ?
                <CircularLoading />
                :
                experts.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                    {experts.map(user =><UserCard 
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

export default UsersPage