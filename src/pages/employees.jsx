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
import UserCard from '../components/cards/user'
import { toast } from 'react-hot-toast'
import EmployeeFormModal from '../components/modals/employee-form'
import FloatingButton from '../components/buttons/floating-button'


const EmployeesPage = ({ roles }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    
    const [isShowModal, setIsShowModal] = useState(false)
    const [targetUser, setTargetUser] = useState({})

    const [isUpdate, setIsUpdate] = useState(false)
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)

    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [employees, setEmployees] = useState([])


    useEffect(() => {
        roles.includes(user.type) ? null : navigate('/login')
        scroll(0, 0)
    }, [])

    useEffect(() => {

        setIsLoading(true)
        serverRequest.get(`/v1/employees`)
        .then(response => {
            setIsLoading(false)
            setEmployees(response.data.employees)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])

    const searchEmployeesByName = (name) => {
        setIsLoading(true)
        serverRequest.get(`/v1/employees/name/search`, { params: { name } })
        .then(response => {
            setIsLoading(false)
            setEmployees(response.data.employees)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }

    const deleteEmployee = (employeeId) => {
        setIsDeleting(true)
        serverRequest.delete(`/v1/employees/${employeeId}`)
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
            id={targetUser._id}
            isLoading={isDeleting}
            setIsShowModal={setIsShowDeleteModal}
            deleteAction={deleteEmployee}
            />
            :
            null
        }
        {
            isShowModal ?
            <EmployeeFormModal 
            reload={reload}
            setReload={setReload}
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            setShowModalForm={setIsShowModal}
            employee={targetUser}
            />
            :
            null
        }

        <div className="show-mobile">
            <FloatingButton setIsShowForm={setIsShowModal} />
        </div>
        
        <div className="padded-container">
            <PageHeader 
            pageName={'الموظفين'} 
            reload={reload}
            setReload={setReload}
            addBtnText={'اضافة موظف'}
            setShowModalForm={setIsShowModal}
            />
            <div className="search-input-container">
                <SearchInput searchRows={searchEmployeesByName} />
            </div>
            
            {
                isLoading ?
                <CircularLoading />
                :
                employees.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper right-direction">
                    {employees.map(user =><UserCard 
                    user={user} 
                    setReload={setReload} 
                    reload={reload} 
                    setTargetUser={setTargetUser}
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

export default EmployeesPage