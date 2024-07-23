import { useState, useEffect } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import CardTransition from '../transitions/card-transitions'

const ItemFormModal = ({ reload, setReload, setShowModalForm, isUpdate, setIsUpdate, item }) => {

    const [isSubmit, setIsSubmit] = useState(false)

    const [categories, setCategories] = useState([])

    const [name, setName] = useState(isUpdate ? item.name : '')
    const [categoryId, setCategoryId] = useState(isUpdate ? item.categoryId : '')
    const [price, setPrice] = useState(isUpdate ? item.price : '')
    const [barcode, setBarcode] = useState(isUpdate ? item.barcode : '')
    const [description, setDescription] = useState(isUpdate ? item.description : '')
    const [sku, setSku] = useState(isUpdate ? item.sku : '')
    const [reorderLevel, setReorderLevel] = useState(isUpdate ? item.reorderLevel : 0)

    
    const [nameError, setNameError] = useState()
    const [categoryIdError, setCategoryIdError] = useState()
    const [priceError, setPriceError] = useState()
    const [barcodeError, setBarcodeError] = useState()
    const [descriptionError, setDescriptionError] = useState()
    const [skuError, setSkuError] = useState()
    const [reorderLevelError, setReorderLevelError] = useState()
    
    useEffect(() => {
        serverRequest.get(`/v1/specialities`)
        .then(response => {
            setCategories(response.data.specialities)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!name) return setNameError('الاسم مطلوب')

        if(!categoryId) return setCategoryIdError('الفئة مطلوبة')

        if(!price) return setPriceError('السعر مطلوب')

        if(reorderLevel !== 0 && !reorderLevel) return setReorderLevelError('مستوى إعادة الطلب مطلوب') 

        const itemData = {
            name,
            sku,
            categoryId,
            price: Number.parseFloat(price),
            barcode,
            reorderLevel: Number.parseFloat(reorderLevel),
            description
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/items`, itemData)
        .then(response => {
            setIsSubmit(false)
            setReload ? setReload(reload + 1) : null
            setShowModalForm(false)
            toast.success(response.data.message, { position: 'top-left', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            try {
                toast.error(error.response.data.message, { position: 'top-left', duration: 3000 })

            } catch(error) {}
        })

    }

    const handleUpdate = (e) => {
        e.preventDefault()

        if(!name) return setNameError('الاسم مطلوب')

        if(!categoryId) return setCategoryIdError('الفئة مطلوبة')

        if(!price) return setPriceError('السعر مطلوب')

        if(reorderLevel !== 0 && !reorderLevel) return setReorderLevelError('مستوى إعادة الطلب مطلوب') 

        const itemData = {
            name,
            sku,
            categoryId,
            price: Number.parseFloat(price),
            barcode,
            reorderLevel: Number.parseFloat(reorderLevel),
            description
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/items/${item._id}`, itemData)
        .then(response => {
            setIsSubmit(false)
            setReload(reload + 1)
            setShowModalForm(false)
            setIsUpdate(false)
            toast.success(response.data.message, { position: 'top-left', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            try {
                toast.error(error.response.data.message, { position: 'top-left', duration: 3000 })

            } catch(error) {}
        })

    }

    return <div className="modal">
        <CardTransition>
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2 className="flex-space-between">
                    { isUpdate ? `تحديث المنتج رقم ${item.itemId}` : 'اضافة منتج'}
                </h2>
            </div>
            <div className="modal-body-container">
                <form 
                id="patient-form" 
                className="modal-form-container responsive-form body-text" 
                onSubmit={isUpdate ? handleUpdate : handleSubmit}
                >
                    <div className="form-input-container">
                        <label>*الفئة</label>
                        <select
                        className="form-input"
                        onChange={e => setCategoryId(e.target.value)}
                        onClick={() => setCategoryIdError()}
                        >
                            <option selected disabled>اختر الفئة</option>
                            {categories.map(category => {
                                if(category._id === categoryId) {
                                    return <option selected value={category._id}>
                                    {category.name}
                                </option>
                                }
                                return <option value={category._id}>
                                    {category.name}
                                </option>
                            })}
                        </select>
                        <span className="red">{categoryIdError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>*الاسم</label>
                        <input
                        type="text"
                        className="form-input"
                        onChange={e => setName(e.target.value)}
                        onClick={() => setNameError()}
                        value={name}
                        />
                        <span className="red">{nameError}</span>
                    </div>
                               
                    <div className="form-input-container">
                        <label>*السعر</label>
                        <input
                        type="number"
                        className="form-input"
                        onChange={e => setPrice(e.target.value)}
                        onClick={() => setPriceError()}
                        value={price}
                        />
                        <span className="red">{priceError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>وحدة حفظ المخزون</label>
                        <input
                        type="text"
                        className="form-input"
                        onChange={e => setSku(e.target.value)}
                        onClick={() => setSkuError()}
                        value={sku}
                        />
                        <span className="red">{skuError}</span>
                    </div>
                    
                    <div className="form-input-container">
                        <label>باركود</label>
                        <input
                        type="text"
                        className="form-input"
                        onChange={e => setBarcode(e.target.value)}
                        onClick={() => setBarcodeError()}
                        value={barcode}
                        />
                        <span className="red">{barcodeError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>مستوى إعادة الطلب</label>
                        <input
                        type="number"
                        className="form-input"
                        onChange={e => setReorderLevel(e.target.value)}
                        onClick={() => setReorderLevelError()}
                        value={reorderLevel}
                        />
                        <span className="red">{reorderLevelError}</span>
                    </div>
                </form>
                <div className="form-input-container">
                    <label>ملحوظة</label>
                    <textarea
                    className="form-input"
                    rows="10"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    onClick={() => setDescriptionError()}
                    >
                    </textarea>
                    <span>{descriptionError}</span>
                </div>

            </div>
            <div className="modal-form-btn-container">
                <div>
                    {
                        isSubmit ?
                        <TailSpin width="25" height="25" color="#4c83ee" />
                        :
                        <button 
                        form="patient-form"
                        className="normal-button white-text action-color-bg"
                        >{isUpdate ? 'تحديث' : 'اضافة'}</button>
                    }
                </div>
                <div>
                    <button 
                    className="normal-button cancel-button"
                    onClick={e => {
                        setShowModalForm(false)
                        setIsUpdate ? setIsUpdate(false) : null
                    }}
                    >الغاء</button>
                </div>
            </div>
        </div>
        </CardTransition>
    </div>
}


export default ItemFormModal