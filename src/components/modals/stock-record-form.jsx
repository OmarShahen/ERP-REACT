import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { useSelector } from 'react-redux'
import CardTransition from '../transitions/card-transitions'


const StockRecordFormModal = ({ reload, setReload, setShowModalForm, isUpdate, setIsUpdate, item }) => {

    const user = useSelector(state => state.user.user)

    const [isSubmit, setIsSubmit] = useState(false)

    const [type, setType] = useState()
    const [effect, setEffect] = useState()
    const [quantity, setQuantity] = useState()
    const [totalPrice, setTotalPrice] = useState()

    const [typeError, setTypeError] = useState()
    const [effectError, setEffectError] = useState()
    const [quantityError, setQuantityError] = useState()
    const [totalPriceError, setTotalPriceError] = useState()

    const types = [
        { name: 'استلام', value: 'PURCHASE' },
        { name: 'استرجاع', value: 'RETURN' },
        { name: 'تعديل', value: 'ADJUSTMENT' },
    ]

    const effects = [
        { name: 'زيادة في الكمية', value: 'LOSS' },
        { name: 'انقاص في الكمية', value: 'WIN' }
    ]
    

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!type) return setTypeError('الفئة مطلوب')

        if(type === 'ADJUSTMENT' && !effect) return setEffectError('نوع المعاملة مطلوب')

        if(!quantity) return setQuantityError('الكمية مطلوبة')

        if(!totalPrice) return setTotalPriceError('اجمالي السعر مطلوب')

        const stockRecordData = {
            userId: user._id,
            itemId: item._id,
            type,
            effect,
            quantity: Number.parseFloat(quantity),
            totalPrice: Number.parseFloat(totalPrice)
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/stock-records`, stockRecordData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            reload ? setReload(reload + 1) : null
            setShowModalForm(false)
            toast.success(data.message, { position: 'top-left', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            try {

                const errorData = error?.response?.data

                if(errorData.field === 'quantity') return setQuantityError(errorData.message)

                toast.error(error.response.data.message, { position: 'top-left', duration: 3000 })

            } catch(error) {}
        })

    }


    return <div className="modal">
        <CardTransition>
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>اضافة معاملة</h2>
            </div>
            <div className="modal-body-container">
                <form 
                id="lead-form" 
                className="modal-form-container responsive-form body-text right-direction" 
                onSubmit={handleSubmit}
                >
                    <div className="form-input-container">
                        <label>المنتج</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        placeholder=""
                        value={item?.name}
                        disabled
                        />
                    </div>
                    <div className="form-input-container">
                        <label>الفئة</label>
                        <select
                        className="form-input"
                        onChange={e => {
                            const value = e.target.value
                            setType(value)

                            if(value !== 'ADJUSTMENT') {
                                setEffect('LOSS')
                            }
                        }}
                        onClick={() => setTypeError()}
                        >
                            <option selected default>اختر الفئة</option>
                            {types.map(type => {
                                return <option value={type.value}>{type.name}</option>
                            })}
                        </select>
                        <span className="red">{typeError}</span>
                    </div>
                    {
                        type === 'ADJUSTMENT' ?
                        <div className="form-input-container">
                            <label>النوع</label>
                            <select
                            className="form-input"
                            onChange={e => setEffect(e.target.value)}
                            onClick={() => setEffectError()}
                            >
                                <option selected default>اختر النوع</option>
                                {effects.map(effect => {
                                    return <option value={effect.value}>{effect.name}</option>
                                })}
                            </select>
                            <span className="red">{effectError}</span>
                        </div>
                        :
                        null
                    }
                    <div className="form-input-container">
                        <label>الكمية</label>
                        <input 
                        type="number" 
                        className="form-input" 
                        placeholder=""
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        onClick={() => setQuantityError()}
                        />
                        <span className="red">{quantityError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>اجمالي السعر</label>
                        <input 
                        type="number" 
                        className="form-input" 
                        placeholder=""
                        value={totalPrice}
                        onChange={e => setTotalPrice(e.target.value)}
                        onClick={() => setTotalPriceError()}
                        />
                        <span className="red">{totalPriceError}</span>
                    </div>
                </form>
            </div>
            <div className="modal-form-btn-container">
                <div>
                    {
                        isSubmit ?
                        <TailSpin width="25" height="25" color="#4c83ee" />
                        :
                        <button 
                        form="lead-form"
                        className="normal-button white-text action-color-bg"
                        >اضافة</button>
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

export default StockRecordFormModal