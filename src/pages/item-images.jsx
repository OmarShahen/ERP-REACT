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
import SelectInputField from '../components/inputs/select'
import ItemCard from '../components/cards/item'
import ItemFormModal from '../components/modals/item-form'
import ImageCard from '../components/cards/image-card'
import UploadFileFormModal from '../components/modals/file-upload-form'
import FloatingButton from '../components/buttons/floating-button'


const ItemImagesPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const itemId = pagePath.split('/')[2]

    const user = useSelector(state => state.user.user)
    
    const [isShowModal, setIsShowModal] = useState(false)
    const [target, setTarget] = useState({})

    const [isUpdate, setIsUpdate] = useState(false)
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowUpdateModal, setIsShowUpdateModal] = useState(false)

    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [item, setItem] = useState({})

    useEffect(() => {
        isRolesValid(user.roles, roles) ? null : navigate('/login')
        scroll(0, 0)
    }, [])

    useEffect(() => {

        setIsLoading(true)
        serverRequest.get(`/v1/items/${itemId}`)
        .then(response => {
            setIsLoading(false)
            setItem(response.data.item)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])

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
            <UploadFileFormModal 
            setReload={setReload}
            reload={reload}
            setShowFormModal={setIsShowModal}
            isUpdate={isUpdate}
            />
            :
            null
        }

        <div className="show-mobile">
            <FloatingButton setIsShowForm={setIsShowModal} />
        </div>
        
        <div className="padded-container">
            <PageHeader 
            pageName={isLoading ? 'Loading...' : `${item?.category?.name} ${item?.subcategory?.name} ${item?.brand?.name} #${item?.itemId}`} 
            reload={reload}
            setReload={setReload}
            addBtnText={'Add Images'}
            setShowModalForm={setIsShowModal}
            />
            
            <br />
            {
                isLoading ?
                <CircularLoading />
                :
                item?.images?.length !== 0 ?
                <div className="cards-grey-container images-container">
                    {item?.images?.map(image => <ImageCard 
                    imageURL={image} 
                    setReload={setReload}
                    reload={reload}
                    itemId={itemId}
                    />)}
                </div>
                :
                <EmptySection setIsShowForm={setIsShowModal} />
            }
        </div>
        
    </div>
}

export default ItemImagesPage