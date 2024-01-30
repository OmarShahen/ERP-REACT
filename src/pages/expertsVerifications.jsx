import { useState, useEffect } from 'react'
import './prescriptions.css'
import { serverRequest } from "../components/API/request"
import PageHeader from '../components/sections/page-header'
import Card from '../components/cards/card';
import CircularLoading from '../components/loadings/circular';
import FiltersSection from '../components/sections/filters/filters'
import EmptySection from '../components/sections/empty/empty'
import { formatNumber } from '../utils/numbers'
import { isRolesValid } from '../utils/roles'
import PaymentCard from '../components/cards/payment'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import UpdateConfirmationModal from '../components/modals/confirmation/update-confirmation-modal';
import { toast } from 'react-hot-toast'
import ExpertVerificationCard from '../components/cards/expert-verification';
import DeleteConfirmationModal from '../components/modals/confirmation/delete-confirmation-modal';
import ExpertVerificationFormModal from '../components/modals/expert-verification-form';
import { setIsShowModal } from '../redux/slices/modalSlice';
import SearchInput from '../components/inputs/search';


const ExpertsVerificationsPage = ({ roles }) => {

    const [target, setTarget] = useState({})
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowUpdateModal, setIsShowUpdateModal] = useState(false)
    const [status, setStatus] = useState()

    const [isLoading, setIsLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [reload, setReload] = useState(1)
    const [showModalForm, setShowModalForm] = useState(false)
    const [expertsVerifications, setExpertsVerifications] = useState([])
    const [viewStatus, setViewStatus] = useState('ALL')

    const [totalExpertsVerifications, setTotalExpertsVerifications] = useState(0)
    const [totalAcceptedExpertsVerifications, setTotalAcceptedExpertsVerifications] = useState(0)
    const [totalPendingExpertsVerifications, setTotalPendingExpertsVerifications] = useState(0)
    const [totalRejectedExpertsVerifications, setTotalRejectedExpertsVerifications] = useState(0)

    const activeElementColor = { border: '2px solid #4c83ee', color: '#4c83ee' }

    const [statsQuery, setStatsQuery] = useState({})

    useEffect(() => { 
        scroll(0,0) 
        //isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/experts-verifications`, { params: { ...statsQuery, status } })
        .then(response => {
            setIsLoading(false)
            setExpertsVerifications(response.data.expertsVerifications)
            setTotalExpertsVerifications(response.data.totalExpertsVerifications)
            setTotalAcceptedExpertsVerifications(response.data.totalAcceptedExpertsVerifications)
            setTotalPendingExpertsVerifications(response.data.totalPendingExpertsVerifications)
            setTotalRejectedExpertsVerifications(response.data.totalRejectedExpertsVerifications)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery, status])


    const deleteExpertVerification = (expertVerificationId) => {
        setIsDeleting(true)
        serverRequest.delete(`/v1/experts-verifications/${expertVerificationId}`)
        .then(response => {
            setIsDeleting(false)
            setReload(reload + 1)
            setIsShowDeleteModal(false)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            setIsDeleting(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    const searchExpertsVerifications = (value) => {
        if(!value) {
            setReload(reload + 1)
            return
        }
        setIsLoading(true)
        serverRequest.get(`/v1/experts-verifications/search/name?name=${value}`)
        .then(response => {
            setIsLoading(false)
            setExpertsVerifications(response.data.expertsVerifications)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    return <div className="page-container">
        {
            showModalForm ?
            <ExpertVerificationFormModal 
            expertVerification={target}
            setShowModalForm={setShowModalForm}
            setReload={setReload}
            reload={reload}
            />
            :
            null
        }
        { 
            isShowDeleteModal ? 
            <DeleteConfirmationModal 
            setIsShowModal={setIsShowDeleteModal}
            isLoading={isDeleting}
            deleteAction={deleteExpertVerification}
            id={target._id}
            /> 
            : 
            null 
        }
        <div className="padded-container">
            <PageHeader 
            pageName={'Experts Verifications'} 
            setReload={setReload}
            reload={reload}
            totalNumber={totalExpertsVerifications}
            /> 
            <div className="cards-3-list-wrapper">
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Pending'}
                number={formatNumber(totalPendingExpertsVerifications)}
                iconColor={'#FF579A'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Accepted'}
                number={formatNumber(totalAcceptedExpertsVerifications)}
                iconColor={'#FF579A'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Rejected'}
                number={formatNumber(totalRejectedExpertsVerifications)}
                iconColor={'#FF579A'}
                />
            </div>
            <br />
            <FiltersSection 
            statsQuery={statsQuery} 
            setStatsQuery={setStatsQuery} 
            isShowUpcomingDates={false}
            defaultValue={'LIFETIME'}
            />
            <div className="search-input-container">
                <SearchInput
                searchRows={searchExpertsVerifications}
                isSearchRemote={true}
                isHideClinics={true}
                isShowStatus={true}
                isShowStages={true}
                />
            </div>
            <div className="appointments-categories-container">
                    <div style={ viewStatus === 'ALL' ? activeElementColor : null } onClick={e => {
                        setStatus()
                        setViewStatus('ALL')
                    }}>
                        All
                    </div>
                    <div style={ viewStatus === 'PENDING' ?  activeElementColor : null } onClick={e => {
                        setStatus('PENDING')
                        setViewStatus('PENDING')
                    }}>
                        Pending
                    </div>
                    <div style={ viewStatus === 'ACCEPTED' ?  activeElementColor : null } onClick={e => {
                        setStatus('ACCEPTED')
                        setViewStatus('ACCEPTED')
                    }}>
                        Accepted
                    </div>
                    <div style={ viewStatus === 'REJECTED' ?  activeElementColor : null } onClick={e => {
                        setStatus('REJECTED')
                        setViewStatus('REJECTED')
                    }}>
                        Rejected
                    </div>
            </div>
            {
                isLoading ?
                <CircularLoading />
                :
                expertsVerifications.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                        {expertsVerifications.map(expertVerification => <ExpertVerificationCard 
                        expertVerification={expertVerification} 
                        setIsShowDeleteModal={setIsShowDeleteModal}
                        setTarget={setTarget}
                        setIsShowUpdateModal={setShowModalForm}
                        />)}                    
                </div>
                :
                <EmptySection setIsShowForm={setShowModalForm} />
            }
        </div>
        
    </div>
}

export default ExpertsVerificationsPage