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
import { toast } from 'react-hot-toast'
import CustomerCard from '../components/cards/customer'
import CustomerFormModal from '../components/modals/customer-form'
import FloatingButton from '../components/buttons/floating-button';

const CustomersPage = ({ roles }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    
    const [isShowModal, setIsShowModal] = useState(false)
    const [target, setTarget] = useState({})

    const [isUpdate, setIsUpdate] = useState(false)
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowUpdateModal, setIsShowUpdateModal] = useState(false)

    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [customers, setCustomers] = useState([])
    const [totalCustomers, setTotalCustomers] = useState(0)

    const [statsQuery, setStatsQuery] = useState({})

    useEffect(() => {
        isRolesValid(user.roles, roles) ? null : navigate('/login')
        scroll(0, 0)
    }, [])

    useEffect(() => {

        setIsLoading(true)
        serverRequest.get(`/v1/customers`, { params: { ...statsQuery } })
        .then(response => {
            setIsLoading(false)
            setCustomers(response.data.customers)
            setTotalCustomers(response.data.totalCustomers)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery])

    const searchCustomersByName = (value) => {
        setIsLoading(true)
        serverRequest.get(`/v1/customers/search/name/phone`, { params: { name: value, phone: value } })
        .then(response => {
            setIsLoading(false)
            setCustomers(response.data.customers)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }

    const deleteCustomer = (customerId) => {
        setIsDeleting(true)
        serverRequest.delete(`/v1/customers/${customerId}`)
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


    return <div className="page-container">
        {
            isShowDeleteModal ?
            <DeleteConfirmationModal 
            id={target._id}
            isLoading={isDeleting}
            setIsShowModal={setIsShowDeleteModal}
            deleteAction={deleteCustomer}
            />
            :
            null
        }
        {
            isShowModal ?
            <CustomerFormModal 
            reload={reload}
            setReload={setReload}
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            setShowModalForm={setIsShowModal}
            customer={target}
            />
            :
            null
        }

        <div className="show-mobile">
            <FloatingButton setIsShowForm={setIsShowModal} />
        </div>
        
        <div className="padded-container">
            <PageHeader 
            pageName={'Customers'} 
            reload={reload}
            setReload={setReload}
            totalNumber={totalCustomers}
            addBtnText={'Add Customer'}
            setShowModalForm={setIsShowModal}
            />
            <FiltersSection 
            setStatsQuery={setStatsQuery} 
            statsQuery={statsQuery}
            defaultValue={'LIFETIME'}
            />
            
            <div className="search-input-container">
                    <SearchInput 
                    searchRows={searchCustomersByName}
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
                customers.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                    {customers.map(customer =><CustomerCard 
                    customer={customer} 
                    setReload={setReload} 
                    reload={reload} 
                    setTarget={setTarget}
                    setIsUpdate={setIsUpdate}
                    setIsShowDeleteModal={setIsShowDeleteModal}
                    setIsShowUpdateModal={setIsShowModal}
                    />)}
                </div>
                :
                <EmptySection setIsShowForm={setIsShowModal} />
            }
        </div>
        
    </div>
}

export default CustomersPage