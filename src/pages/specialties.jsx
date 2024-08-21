import { useState, useEffect } from 'react'
import './prescriptions.css'
import { serverRequest } from "../components/API/request"
import PageHeader from '../components/sections/page-header'
import CircularLoading from '../components/loadings/circular';
import EmptySection from '../components/sections/empty/empty'
import { useNavigate } from 'react-router-dom'
import SpecialtyCard from '../components/cards/specialty'
import { toast } from 'react-hot-toast'
import DeleteConfirmationModal from '../components/modals/confirmation/delete-confirmation-modal';
import SpecialtyFormModal from '../components/modals/specialty-form';
import FloatingButton from '../components/buttons/floating-button';
import { useSelector } from 'react-redux'


const SpecialtiesPage = ({ roles }) => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)

    const [targetSpecialty, setTargetSpecialty] = useState({})
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)

    const [isLoading, setIsLoading] = useState(true)
    const [isDeleteLoading, setIsDeleteLoading] = useState(false)

    const [reload, setReload] = useState(1)
    const [showModalForm, setShowModalForm] = useState(false)
    const [specialties, setSpecialties] = useState([])

    useEffect(() => { 
        scroll(0,0) 
        roles.includes(user.type) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        setIsLoading(true)

        serverRequest.get('/v1/specialities?show=TRUE')
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
            type={'MAIN'}
            />
            :
            null
        }

        <div className="show-mobile">
            <FloatingButton setIsShowForm={setShowModalForm} />
        </div>
        
        <div className="padded-container">
            <PageHeader 
            pageName={'الفئات'} 
            setReload={setReload}
            reload={reload}
            totalNumber={specialties.length}
            addBtnText={'اضافة فئة'}
            setShowModalForm={setShowModalForm}
            /> 
        
            
            {
                isLoading ?
                <CircularLoading />
                :
                specialties.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper right-direction">
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

export default SpecialtiesPage