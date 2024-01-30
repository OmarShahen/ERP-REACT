import { useState, useEffect } from 'react'
import './prescriptions.css'
import { serverRequest } from "../components/API/request"
import PageHeader from '../components/sections/page-header'
import CircularLoading from '../components/loadings/circular';
import EmptySection from '../components/sections/empty/empty'
import { isRolesValid } from '../utils/roles'
import { useNavigate } from 'react-router-dom'
import SpecialtyCard from '../components/cards/specialty'
import { setIsShowModal } from '../redux/slices/modalSlice'
import { toast } from 'react-hot-toast'
import DeleteConfirmationModal from '../components/modals/confirmation/delete-confirmation-modal';
import SpecialtyFormModal from '../components/modals/specialty-form';
import FloatingButton from '../components/buttons/floating-button';


const SpecialtyPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const specialtyId = pagePath.split('/')[2]

    const [targetSpecialty, setTargetSpecialty] = useState({})
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)

    const [isLoading, setIsLoading] = useState(true)
    const [isDeleteLoading, setIsDeleteLoading] = useState(false)

    const [reload, setReload] = useState(1)
    const [showModalForm, setShowModalForm] = useState(false)
    const [specialties, setSpecialties] = useState([])
    const [specialty, setSpecialty] = useState({})

    useEffect(() => { 
        scroll(0,0) 
        //isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/specialities/${specialtyId}`)
        .then(response => {
            setSpecialty(response.data.speciality)
        })
        .catch(error => {
            console.error(error)
        })
    }, [reload])

    useEffect(() => {
        setIsLoading(true)

        serverRequest.get(`/v1/specialities/${specialtyId}/sub-specialities`)
        .then(response => {
            setIsLoading(false)
            setSpecialties(response.data.specialities)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])

    const deleteSpecialty = (id) => {
        setIsDeleteLoading(true)
        serverRequest.delete(`/v1/specialities/${id}`)
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
            deleteAction={deleteSpecialty}
            id={targetSpecialty._id}
            isLoading={isDeleteLoading}
            />
            : 
            null 
        }
        {
            showModalForm ?
            <SpecialtyFormModal 
            reload={reload}
            setReload={setReload}
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            specialty={targetSpecialty}
            setSpecialty={setTargetSpecialty}
            setShowFormModal={setShowModalForm}
            type={'SUB'}
            specialtyId={specialtyId}
            />
            :
            null
        }

        <div className="show-mobile">
            <FloatingButton setIsShowForm={setShowModalForm} />
        </div>
        
        <div className="padded-container">
            <PageHeader 
            pageName={specialty.name} 
            setReload={setReload}
            reload={reload}
            totalNumber={specialties.length}
            addBtnText={'Add Subspecialty'}
            setShowModalForm={setShowModalForm}
            /> 
        
            
            {
                isLoading ?
                <CircularLoading />
                :
                specialties.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                        {specialties.map(specialty => <SpecialtyCard 
                        specialty={specialty} 
                        reload={reload} 
                        setReload={setReload} 
                        setIsShowDelete={setIsShowDeleteModal}
                        setIsShowForm={setShowModalForm}
                        setIsUpdate={setIsUpdate}
                        setTarget={setTargetSpecialty}
                        />)}                    
                </div>
                :
                <EmptySection setIsShowForm={setShowModalForm} />
            }
        </div>
    </div>
}

export default SpecialtyPage