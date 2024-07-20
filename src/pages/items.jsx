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
import ItemCard from '../components/cards/item'
import ItemFormModal from '../components/modals/item-form'
import FloatingButton from '../components/buttons/floating-button'
import StockRecordFormModal from '../components/modals/stock-record-form'


const ItemsPage = ({ roles }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    
    const [isShowModal, setIsShowModal] = useState(false)
    const [target, setTarget] = useState({})

    const [isUpdate, setIsUpdate] = useState(false)
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowUpdateModal, setIsShowUpdateModal] = useState(false)

    const [isShowStockOrderModal, setIsShowStockOrderModal] = useState(false)

    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [items, setItems] = useState([])
    const [specialties, setSpecialties] = useState([])
    const [totalItems, setTotalItems] = useState(0)

    const [searchName, setSearchName] = useState()
    const [searchCategory, setSearchCategory] = useState()

    useEffect(() => {
        roles.includes(user.type) ? null : navigate('/login')
        scroll(0, 0)
    }, [])


    useEffect(() => {
        serverRequest.get('/v1/specialities')
        .then(response => {
            setSpecialties(response.data.specialities)
        })
        .catch(error => {
            console.error(error)
        })
    }, [reload])

    useEffect(() => {

        setIsLoading(true)
        serverRequest.get(`/v1/items/search/name/category`, { params: { name: searchName, categoryId: searchCategory } })
        .then(response => {
            setIsLoading(false)
            setItems(response.data.items)
            setTotalItems(response.data.totalItems)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })

    }, [searchCategory, searchName, reload])

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

    const searchItems = (value) => {
        if(!value) {
            setSearchName()
            setSearchCategory()
            return
        }
       setSearchName(value)
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
        {
            isShowStockOrderModal ?
            <StockRecordFormModal
            reload={reload}
            setReload={setReload}
            setShowModalForm={setIsShowStockOrderModal}
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
            pageName={'المنتجات'} 
            reload={reload}
            setReload={setReload}
            totalNumber={totalItems}
            addBtnText={'اضافة منتج'}
            setShowModalForm={setIsShowModal}
            />
            <div className="search-input-container">
                    <SearchInput searchRows={searchItems} />
                    <select
                    className="form-input"
                    onChange={e => {
                        if(e.target.value === 'ALL') {
                            setSearchCategory()
                            setReload(reload + 1)
                            return
                        }

                        setSearchCategory(e.target.value)
                    }}
                    >
                        <option selected disabled>اختر الفئة</option>
                        <option value={'ALL'}>الكل</option>
                        {specialties.map(category => <option value={category._id}>{category.name}</option>)}
                    </select>
            </div>
            {
                isLoading ?
                <CircularLoading />
                :
                items.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper right-direction">
                    {items.map(item =><ItemCard 
                    item={item} 
                    setReload={setReload} 
                    reload={reload} 
                    setTarget={setTarget}
                    setIsUpdate={setIsUpdate}
                    setIsShowDeleteModal={setIsShowDeleteModal}
                    setIsShowUpdateModal={setIsShowModal}
                    setIsShowStockOrderModal={setIsShowStockOrderModal}
                    />)}
                </div>
                :
                <EmptySection setIsShowForm={setIsShowModal} />
            }
        </div>
        
    </div>
}

export default ItemsPage