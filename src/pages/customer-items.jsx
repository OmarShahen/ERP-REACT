import { useState, useEffect } from 'react'
import './prescriptions.css'
import PageHeader from '../components/sections/page-header'
import { serverRequest } from '../components/API/request'
import CircularLoading from '../components/loadings/circular'
import { useSelector } from 'react-redux'
import EmptySection from '../components/sections/empty/empty'
import { useNavigate } from 'react-router-dom'
import { isRolesValid } from '../utils/roles'
import DeleteConfirmationModal from '../components/modals/confirmation/delete-confirmation-modal'
import { toast } from 'react-hot-toast'
import ItemCard from '../components/cards/item'
import ItemFormModal from '../components/modals/item-form'
import FloatingButton from '../components/buttons/floating-button'


const CustomerItemsPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const ownerId = pagePath.split('/')[3]

    const user = useSelector(state => state.user.user)
    
    const [isShowModal, setIsShowModal] = useState(false)
    const [target, setTarget] = useState({})

    const [isUpdate, setIsUpdate] = useState(false)
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowUpdateModal, setIsShowUpdateModal] = useState(false)

    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [items, setItems] = useState([])
    const [owner, setOwner] = useState({})
    const [totalItems, setTotalItems] = useState(0)

    const [statsQuery, setStatsQuery] = useState({})

    useEffect(() => {
        isRolesValid(user.roles, roles) ? null : navigate('/login')
        scroll(0, 0)
    }, [])

    useEffect(() => {

        setIsLoading(true)
        serverRequest.get(`/v1/items/owners/${ownerId}`, { params: { ...statsQuery } })
        .then(response => {
            setIsLoading(false)
            setItems(response.data.items)
            setTotalItems(response.data.totalItems)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery])

    useEffect(() => {
        serverRequest.get(`/v1/customers/${ownerId}`)
        .then(response => {
            setOwner(response.data.customer)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    const deleteItem = (itemId) => {
        setIsDeleting(true)
        serverRequest.delete(`/v1/items/${itemId}`)
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
            deleteAction={deleteItem}
            />
            :
            null
        }
        {
            isShowModal ?
            <ItemFormModal 
            reload={reload}
            setReload={setReload}
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            setShowModalForm={setIsShowModal}
            item={target}
            />
            :
            null
        }

        <div className="show-mobile">
            <FloatingButton setIsShowForm={setIsShowModal} />
        </div>
        
        <div className="padded-container">
            <PageHeader 
            pageName={`${owner?.name}`} 
            reload={reload}
            setReload={setReload}
            totalNumber={totalItems}
            addBtnText={'Add Item'}
            setShowModalForm={setIsShowModal}
            />
            
            <br />
            {
                isLoading ?
                <CircularLoading />
                :
                items.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                    {items.map(item =><ItemCard 
                    item={item} 
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

export default CustomerItemsPage