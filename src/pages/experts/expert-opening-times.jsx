import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { serverRequest } from "../../components/API/request"
import PageHeader from '../../components/sections/page-header'
import CircularLoading from '../../components/loadings/circular';
import EmptySection from '../../components/sections/empty/empty'
import { isRolesValid } from '../../utils/roles'
import { toast } from 'react-hot-toast'
import ServiceCard from '../../components/cards/service';
import ServiceFormModal from '../../components/modals/service-form'
import DeleteConfirmationModal from '../../components/modals/confirmation/delete-confirmation-modal';
import OpeningTimeCard from '../../components/cards/opening-time';
import OpeningTimeFormModal from '../../components/modals/opening-time-form';


const ExpertOpeningTimesPage = ({ roles }) => {

    const pagePath = window.location.pathname
    const expertId = pagePath.split('/')[2]

    const [target, setTarget] = useState({})
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowUpdateModal, setIsShowUpdateModal] = useState(false)

    const [isDeleteLoading, setIsDeleteLoading] = useState(false)

    const [isLoading, setIsLoading] = useState(true)
    const [isUpdate, setIsUpdate] = useState(false)
    const [reload, setReload] = useState(1)
    const [isShowFormModal, setIsShowFormModal] = useState(false)
    const [openingTimes, setOpeningTimes] = useState([])


    useEffect(() => { 
        scroll(0, 0) 
        //isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/opening-times/experts/${expertId}`)
        .then(response => {
            setIsLoading(false)
            setOpeningTimes(response.data.openingTimes)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload])


    const deleteOpeningTime = (openingTimeID) => {
        setIsDeleteLoading(true)
        serverRequest.delete(`/v1/opening-times/${openingTimeID}`)
        .then(response => {
            setIsDeleteLoading(false)
            setReload(reload + 1)
            setIsShowDeleteModal(false)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            setIsDeleteLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }


    return <div className="page-container">
        { 
            isShowDeleteModal ? 
            <DeleteConfirmationModal
            setIsShowModal={setIsShowDeleteModal}
            deleteAction={deleteOpeningTime}
            id={target._id}
            isLoading={isDeleteLoading}
            />
            : 
            null 
        }
        {
            isShowFormModal ?
            <OpeningTimeFormModal 
            reload={reload}
            setReload={setReload}
            setShowFormModal={setIsShowFormModal}
            setIsUpdate={setIsUpdate}
            isUpdate={isUpdate}
            setOpeningTimeObj={setTarget}
            openingTimeObj={target}
            />
            :
            null
        }
        <div className="padded-container">
            <PageHeader 
            pageName={'Schedule'}
            totalNumber={openingTimes.length}
            addBtnText={'Add Opening Time'}
            setShowModalForm={setIsShowFormModal}
            isHideBackButton={true}
            setReload={setReload}
            reload={reload}
            />
            {
                isLoading ?
                <CircularLoading />
                :
                openingTimes.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                        {openingTimes.map(openingTime => <OpeningTimeCard 
                        openingTime={openingTime} 
                        setIsShowDeleteModal={setIsShowDeleteModal}
                        setIsShowForm={setIsShowFormModal}
                        setTarget={setTarget}
                        setReload={setReload}
                        reload={reload}
                        setIsUpdate={setIsUpdate}
                        />)}                    
                </div>
                :
                <EmptySection setIsShowForm={setIsShowFormModal} />
            }
        </div>       
    </div>
}

export default ExpertOpeningTimesPage