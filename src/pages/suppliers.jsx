import { useState, useEffect } from 'react'
import './prescriptions.css'
import PageHeader from '../components/sections/page-header'
import { serverRequest } from '../components/API/request'
import CircularLoading from '../components/loadings/circular'
import { useSelector } from 'react-redux'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { useNavigate } from 'react-router-dom'
import DeleteConfirmationModal from '../components/modals/confirmation/delete-confirmation-modal'
import { toast } from 'react-hot-toast'
import EmployeeFormModal from '../components/modals/employee-form'
import FloatingButton from '../components/buttons/floating-button'
import SupplierCard from '../components/cards/supplier'
import SupplierFormModal from '../components/modals/supplier-form'


const SuppliersPage = ({ roles }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    
    const [isShowModal, setIsShowModal] = useState(false)
    const [target, setTarget] = useState({})

    const [isUpdate, setIsUpdate] = useState(false)
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)

    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [suppliers, setSuppliers] = useState([])

    const [searchValue, setSearchValue] = useState()


    useEffect(() => {
        roles.includes(user.type) ? null : navigate('/login')
        scroll(0, 0)
    }, [])

    useEffect(() => {

        setIsLoading(true)
        serverRequest.get(`/v1/suppliers`, { params: { name: searchValue, phone: searchValue, note: searchValue } })
        .then(response => {
            setIsLoading(false)
            setSuppliers(response.data.suppliers)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, searchValue])

    const searchEmployees = (value) => {
        setSearchValue(value)
    }

    const deleteSupplier = (supplierId) => {
        setIsDeleting(true)
        serverRequest.delete(`/v1/suppliers/${supplierId}`)
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
            deleteAction={deleteSupplier}
            />
            :
            null
        }
        {
            isShowModal ?
            <SupplierFormModal 
            reload={reload}
            setReload={setReload}
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            setShowModalForm={setIsShowModal}
            supplier={target}
            />
            :
            null
        }

        <div className="show-mobile">
            <FloatingButton setIsShowForm={setIsShowModal} />
        </div>
        
        <div className="padded-container">
            <PageHeader 
            pageName={'الموردين'} 
            reload={reload}
            setReload={setReload}
            addBtnText={'اضافة مورد'}
            setShowModalForm={setIsShowModal}
            />
            <div className="search-input-container">
                <SearchInput searchRows={searchEmployees} />
            </div>
            
            {
                isLoading ?
                <CircularLoading />
                :
                suppliers.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper right-direction">
                    {suppliers.map(supplier =><SupplierCard 
                    supplier={supplier} 
                    setReload={setReload} 
                    reload={reload} 
                    setTarget={setTarget}
                    setIsShowUpdateModal={setIsShowModal}
                    setIsUpdate={setIsUpdate}
                    setIsShowDeleteModal={setIsShowDeleteModal}
                    />)}
                </div>
                    
                :
                <EmptySection setIsShowForm={setIsShowModal} />
            }
        </div>
        
    </div>
}

export default SuppliersPage