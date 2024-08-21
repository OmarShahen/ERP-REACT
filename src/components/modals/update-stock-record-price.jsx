import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import CardTransition from '../transitions/card-transitions'


const UpdateStockRecordPriceFormModal = ({ reload, setReload, setShowModalForm, stockRecord }) => {

    const [isSubmit, setIsSubmit] = useState(false)

    const [totalPrice, setTotalPrice] = useState(stockRecord.totalPrice)
    const [totalPriceError, setTotalPriceError] = useState()
    

    const handleSubmit = (e) => {
        e.preventDefault()

        const stockRecordData = { totalPrice: Number.parseFloat(totalPrice) }

        setIsSubmit(true)
        serverRequest.patch(`/v1/stock-records/${stockRecord._id}/total-price`, stockRecordData)
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

                if(errorData.field === 'totalPrice') return setTotalPriceError(errorData.message)

                toast.error(error.response.data.message, { position: 'top-left', duration: 3000 })

            } catch(error) {}
        })

    }


    return <div className="modal">
        <CardTransition>
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>
                    تعديل المعاملة رقم {stockRecord.stockRecordId}
                </h2>
            </div>
            <div className="modal-body-container">
                <form 
                id="lead-form" 
                className="modal-form-container responsive-form body-text right-direction" 
                onSubmit={handleSubmit}
                >
                    
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
                        >تاكيد</button>
                    }
                </div>
                <div>
                    <button 
                    className="normal-button cancel-button"
                    onClick={e => {
                        setShowModalForm(false)
                    }}
                    >الغاء</button>
                </div>
            </div>
        </div>
        </CardTransition>
    </div>
}

export default UpdateStockRecordPriceFormModal