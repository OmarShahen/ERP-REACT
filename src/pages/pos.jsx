import { useState, useEffect, useRef } from 'react'
import './prescriptions.css'
import { serverRequest } from "../components/API/request"
import PageHeader from '../components/sections/page-header'
import CircularLoading from '../components/loadings/circular';
import EmptySection from '../components/sections/empty/empty'
import { useNavigate } from 'react-router-dom'
import { setIsShowModal } from '../redux/slices/modalSlice'
import { toast } from 'react-hot-toast'
import SearchInput from '../components/inputs/search';
import Receipt from '../components/receipt/receipt';
import POSItemCard from '../components/cards/pos-item';
import { useSelector } from 'react-redux';
import BarcodeScanner from '../components/scanners/Barcode';
import axios from 'axios';

const POSPage = ({ roles }) => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)

    const inputRef = useRef(null)

    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [target, setTarget] = useState()

    const [currentOrder, setCurrentOrder] = useState()

    const [barcode, setBarcode] = useState('')

    const [isLoading, setIsLoading] = useState(true)
    const [isSubmit, setIsSubmit] = useState(false)

    const [reload, setReload] = useState(1)
    const [specialties, setSpecialties] = useState([])
    const [items, setItems] = useState([])

    const [orderItems, setOrderItems] = useState([])

    const [searchName, setSearchName] = useState()
    const [searchCategory, setSearchCategory] = useState()

    useEffect(() => { 
        scroll(0,0) 
        roles.includes(user.type) ? null : navigate('/login')
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
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })

    }, [searchCategory, searchName, reload])

    const searchItems = (value) => {
        if(!value) {
            setSearchName()
            setSearchCategory()
            return
        }
       setSearchName(value)
    }

    const onOrderSubmit = () => {
        
        if(orderItems.length === 0) {
            toast.error('لا يوجد منتاجات في الطلبية', { duration: 3000, position: 'top-left' })
            return
        } 

        const orderItemsList = orderItems.map(orderItem => {
            return { 
                itemId: orderItem._id, 
                quantity: orderItem.quantity, 
                price: orderItem.price,
                name: orderItem.name,
                numericId: orderItem.itemId
            }
        })

        const orderData = {
            cashierId: user._id,
            paymentMethod: 'CASH',
            items: orderItemsList,
            isPaid: true
        }

        setIsSubmit(true)
        serverRequest.post('/v1/orders', orderData)
        .then(response => {
            setIsSubmit(false)
            setOrderItems([])
            setCurrentOrder(response.data.order)
            toast.success(response.data.message, { duration: 3000, position: 'top-left' })
            inputRef.current.focus()
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-left' })
        })

    }

    const printOrder = () => {

        if(!currentOrder) {
            return toast.error('لا يوجد فاتورة للطباعة', { duration: 3000, position: 'top-left' })
        }

        if(isSubmit) {
            return toast.error('لم يسجل الطلب بعد', { duration: 3000, position: 'top-left' })
        }

        axios.post(`http://localhost:5010/orders/${currentOrder._id}/print`)
        .then(response => {
            toast.success(response.data.message, { duration: 3000, position: 'top-left' })
        })
        .catch(error => {
            console.error(error)
            toast.error('هناك مشكلة في الطباعة', { duration: 3000, position: 'top-left' })
        })
    }


    return <div className="page-container">
        <div className="padded-container pos-layout">
            <div className="margin-top-1">
                <div className="cards-grey-container">
                    <Receipt 
                    orderItems={orderItems}
                    setOrderItems={setOrderItems} 
                    onSubmit={onOrderSubmit}
                    isSubmit={isSubmit}
                    printOrder={printOrder}
                    />
                </div>
            </div>
            <div>
            <PageHeader 
            pageName={'نقطة البيع'} 
            setReload={setReload}
            reload={reload}
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
                    <BarcodeScanner 
                    setOrderItems={setOrderItems}
                    orderItems={orderItems}
                    inputRef={inputRef}
                    barcode={barcode}
                    setBarcode={setBarcode}
                    />
            </div>

            {
                isLoading ?
                <CircularLoading />
                :
                items.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper right-direction">
                    {items.map(item =><POSItemCard
                    item={item} 
                    setOrderItems={setOrderItems}
                    orderItems={orderItems}
                    setReload={setReload} 
                    reload={reload} 
                    setTarget={setTarget}
                    setIsUpdate={setIsUpdate}
                    setIsShowDeleteModal={setIsShowDeleteModal}
                    setIsShowUpdateModal={setIsShowModal}
                    />)}
                </div>
                :
                <EmptySection />
            }
        </div>
    </div>
    </div>
}

export default POSPage