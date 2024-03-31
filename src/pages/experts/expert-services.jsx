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


const ExpertServicesPage = ({ roles }) => {

    const pagePath = window.location.pathname
    const expertId = pagePath.split('/')[2]

    const [target, setTarget] = useState({})
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)

    const [isDeleteLoading, setIsDeleteLoading] = useState(false)

    const [isLoading, setIsLoading] = useState(true)
    const [isUpdate, setIsUpdate] = useState(false)
    const [reload, setReload] = useState(1)
    const [isShowFormModal, setIsShowFormModal] = useState(false)
    const [services, setServices] = useState([])


    useEffect(() => { 
        scroll(0, 0) 
        //isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/services/experts/${expertId}`)
        .then(response => {
            setIsLoading(false)
            setServices(response.data.services)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload])


    const deleteService = (serviceId) => {
        setIsDeleteLoading(true)
        serverRequest.delete(`/v1/services/${serviceId}`)
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
            deleteAction={deleteService}
            id={target._id}
            isLoading={isDeleteLoading}
            />
            : 
            null 
        }
        {
            isShowFormModal ?
            <ServiceFormModal 
            reload={reload}
            setReload={setReload}
            setShowFormModal={setIsShowFormModal}
            setIsUpdate={setIsUpdate}
            isUpdate={isUpdate}
            setService={setTarget}
            service={target}
            />
            :
            null
        }
        <div className="padded-container">
            <PageHeader 
            pageName={'Services'}
            totalNumber={services.length}
            addBtnText={'Add Service'}
            setShowModalForm={setIsShowFormModal}
            isHideBackButton={true}
            setReload={setReload}
            reload={reload}
            />
            {
                isLoading ?
                <CircularLoading />
                :
                services.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                        {services.map(service => <ServiceCard 
                        service={service} 
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

export default ExpertServicesPage